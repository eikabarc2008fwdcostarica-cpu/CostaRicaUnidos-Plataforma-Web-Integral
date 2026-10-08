import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuditLogView, { CATEGORIAS_AUDITORIA } from './AuditLogView';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const THEME = { primary: '#F36717', glow: 'rgba(243,103,23,.4)', nombre: 'Puntarenas' };

describe('AuditLogView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { nombre: 'Dirección Regional', id: 'USR-PROV-006', provinciaId: '6' } });
  });

  const selects = () => screen.getAllByRole('combobox');
  const [CATEGORIA, PERIODO] = [0, 1];

  test('renderiza la cabecera con la provincia y los controles de filtrado', () => {
    render(<AuditLogView provinciaTheme={THEME} />);

    expect(screen.getByRole('heading', { name: /Bitácora Inmutable de Auditoría/ })).toBeInTheDocument();
    expect(screen.getByText(/Registro cronológico criptográfico de acciones de gobierno en Puntarenas/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Buscar por acción, IP, hash o ticket/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verificar Integridad de Hash/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exportar Bitácora/ })).toBeInTheDocument();
    expect(selects()).toHaveLength(2);
    expect(screen.getByRole('option', { name: 'Categoría: Triaje Vial (M07)' })).toBeInTheDocument();
    expect(CATEGORIAS_AUDITORIA).toHaveLength(6);
  });

  test('con el período "Todo el Histórico" se muestran los 7 registros y el contador lo refleja', async () => {
    render(<AuditLogView provinciaTheme={THEME} />);

    await userEvent.selectOptions(selects()[PERIODO], 'TODOS');

    expect(screen.getByText(/Registros mostrados/)).toHaveTextContent('Registros mostrados: 7 de 7');
    expect(screen.getByText(/Cierre exitoso de ticket CRU-8926/)).toBeInTheDocument();
  });

  test('filtra por categoría de auditoría', async () => {
    render(<AuditLogView provinciaTheme={THEME} />);
    await userEvent.selectOptions(selects()[PERIODO], 'TODOS');

    await userEvent.selectOptions(selects()[CATEGORIA], 'TRIAJE_M07');

    expect(screen.getByText(/Registros mostrados/)).toHaveTextContent('Registros mostrados: 3 de 7');
    expect(screen.queryByText(/Alerta Amarilla provincial ratificada/)).not.toBeInTheDocument();
  });

  test('filtra por texto (ticket) y muestra el estado vacío si no hay coincidencias', async () => {
    render(<AuditLogView provinciaTheme={THEME} />);
    await userEvent.selectOptions(selects()[PERIODO], 'TODOS');
    const input = screen.getByPlaceholderText(/Buscar por acción, IP, hash o ticket/);

    await userEvent.type(input, 'CRU-8923');
    expect(screen.getByText(/Registros mostrados/)).toHaveTextContent('Registros mostrados: 1 de 7');

    await userEvent.clear(input);
    await userEvent.type(input, 'texto-inexistente-xyz');
    expect(screen.getByText(/Registros mostrados/)).toHaveTextContent('Registros mostrados: 0 de 7');
  });

  test('copiar hash escribe el hash completo en el portapapeles', async () => {
    const writeText = jest.fn();
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    render(<AuditLogView provinciaTheme={THEME} />);
    await userEvent.selectOptions(selects()[PERIODO], 'TODOS');

    await userEvent.click(screen.getAllByTitle('Copiar hash de integridad completo')[0]);

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText.mock.calls[0][0]).toMatch(/^SHA256:/);
  });

  test('verificar integridad muestra el estado "Verificando" y luego confirma la cadena', () => {
    jest.useFakeTimers();
    try {
      render(<AuditLogView provinciaTheme={THEME} />);
      const boton = screen.getByRole('button', { name: /Verificar Integridad de Hash/ });

      act(() => boton.click());
      expect(screen.getByRole('button', { name: /Verificando Cadena/ })).toBeDisabled();

      act(() => { jest.advanceTimersByTime(1300); });
      expect(screen.getByText(/CADENA DE AUDITOR.A .NTEGRA/)).toBeInTheDocument();

      act(() => { jest.advanceTimersByTime(5100); });
      expect(screen.queryByText(/CADENA DE AUDITOR.A .NTEGRA/)).not.toBeInTheDocument();
    } finally {
      jest.useRealTimers();
    }
  });

  test('exportar bitácora genera un archivo JSON con nombre de la provincia', async () => {
    URL.createObjectURL = jest.fn(() => 'blob:mock');
    const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    let downloadName = '';
    const originalCreate = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation((tag, ...rest) => {
      const el = originalCreate(tag, ...rest);
      if (tag === 'a') {
        Object.defineProperty(el, 'download', { set: (v) => { downloadName = v; }, get: () => downloadName });
      }
      return el;
    });
    render(<AuditLogView provinciaTheme={THEME} />);

    await userEvent.click(screen.getByRole('button', { name: /Exportar Bitácora/ }));

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(downloadName).toBe('bitacora_auditoria_provincial_puntarenas_2026.json');
    jest.restoreAllMocks();
  });
});
