import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTabNavigation, { ADMIN_TABS } from './AdminTabNavigation';

describe('AdminTabNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza las 4 pestañas normadas con su código y badge por defecto', () => {
    render(<AdminTabNavigation />);

    expect(screen.getByRole('navigation', { name: 'Navegación de módulos provinciales' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(ADMIN_TABS.length);
    expect(screen.getByText('Triaje de Incidencias (M07)')).toBeInTheDocument();
    expect(screen.getByText('Comando CNE y Albergues (M10)')).toBeInTheDocument();
    expect(screen.getByText('Telemetría Territorial')).toBeInTheDocument();
    expect(screen.getByText('Bitácora de Auditoría')).toBeInTheDocument();
    expect(screen.getByText('8 Críticas')).toBeInTheDocument();
    expect(screen.getByText('Alerta Amarilla')).toBeInTheDocument();
    expect(screen.getByText('En Vivo')).toBeInTheDocument();
    expect(screen.getByText('Inmutable')).toBeInTheDocument();
  });

  test('marca como seleccionada solo la pestaña activa (por defecto "incidencias")', () => {
    render(<AdminTabNavigation />);

    expect(document.getElementById('tab-btn-incidencias')).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById('tab-btn-cne')).toHaveAttribute('aria-selected', 'false');
    expect(document.getElementById('tab-btn-telemetria')).toHaveAttribute('aria-selected', 'false');
    expect(document.getElementById('tab-btn-auditoria')).toHaveAttribute('aria-selected', 'false');
  });

  test('respeta la prop activeTab', () => {
    render(<AdminTabNavigation activeTab="auditoria" />);

    expect(document.getElementById('tab-btn-auditoria')).toHaveAttribute('aria-selected', 'true');
    expect(document.getElementById('tab-btn-incidencias')).toHaveAttribute('aria-selected', 'false');
  });

  test('al hacer clic en una pestaña llama a onTabChange con su id', async () => {
    // Arrange
    const onTabChange = jest.fn();
    render(<AdminTabNavigation onTabChange={onTabChange} />);

    // Act
    await userEvent.click(screen.getByRole('tab', { name: /Comando CNE y Albergues/ }));
    await userEvent.click(screen.getByRole('tab', { name: /Telemetría Territorial/ }));

    // Assert
    expect(onTabChange).toHaveBeenNthCalledWith(1, 'cne');
    expect(onTabChange).toHaveBeenNthCalledWith(2, 'telemetria');
  });

  test('badgeCounts sobrescribe el texto del badge de la pestaña correspondiente', () => {
    render(<AdminTabNavigation badgeCounts={{ incidencias: 42, cne: '3 activas' }} />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('3 activas')).toBeInTheDocument();
    expect(screen.queryByText('8 Críticas')).not.toBeInTheDocument();
    expect(screen.queryByText('Alerta Amarilla')).not.toBeInTheDocument();
  });

  test('aplica el color primario del tema provincial a la pestaña activa', () => {
    render(<AdminTabNavigation provinciaTheme={{ primary: '#05853B', glow: 'rgba(5,133,59,.4)', nombre: 'Guanacaste' }} />);

    expect(document.getElementById('tab-btn-incidencias').style.border).toContain('rgb(5, 133, 59)');
  });
});
