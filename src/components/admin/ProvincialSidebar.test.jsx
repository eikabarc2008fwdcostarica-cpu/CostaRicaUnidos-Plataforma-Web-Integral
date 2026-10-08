import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProvincialSidebar, { NAV_ITEMS } from './ProvincialSidebar';
import { useAuth } from '../../context/AuthContext';

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
  PROVINCIAS_COSTA_RICA: [
    { id: '1', nombre: 'San José' },
    { id: '6', nombre: 'Puntarenas' },
  ],
}));

describe('ProvincialSidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({ user: { nombre: 'Laura Mora', provinciaId: '1' } });
  });

  test('renderiza título, jurisdicción del usuario y los 6 módulos territoriales', () => {
    render(<ProvincialSidebar />);

    expect(screen.getByRole('heading', { name: 'Gestión Territorial y Municipal' })).toBeInTheDocument();
    expect(screen.getByText('JURISDICCIÓN: SAN JOSÉ')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: 'Módulos territoriales' });
    expect(nav.querySelectorAll('button')).toHaveLength(NAV_ITEMS.length);
    expect(screen.getByText('Gobiernos Locales y Concejos')).toBeInTheDocument();
    expect(screen.getByText('Emergencias CNE (M10)')).toBeInTheDocument();
    expect(screen.getByText('Laura Mora')).toBeInTheDocument();
    expect(screen.getByText(/GESTOR TERRITORIAL • San José/)).toBeInTheDocument();
  });

  test('marca el módulo activo con aria-current="page" y muestra el badge de la Gaceta', () => {
    render(<ProvincialSidebar activeModule="gaceta" />);

    expect(screen.getByTitle('Gaceta de Actas y Acuerdos')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByTitle('Gobiernos Locales y Concejos')).not.toHaveAttribute('aria-current');
    expect(screen.getByLabelText('6 notificaciones')).toHaveTextContent('6');
  });

  test('clic en un módulo llama a setActiveModule y cierra el drawer móvil', async () => {
    const setActiveModule = jest.fn();
    const setIsMobileOpen = jest.fn();
    render(<ProvincialSidebar setActiveModule={setActiveModule} setIsMobileOpen={setIsMobileOpen} />);

    await userEvent.click(screen.getByTitle('Organigrama de Dependencias'));

    expect(setActiveModule).toHaveBeenCalledWith('organigrama');
    expect(setIsMobileOpen).toHaveBeenCalledWith(false);
  });

  test('el botón de colapso alterna el estado y cambia su etiqueta según el estado', async () => {
    const setIsSidebarCollapsed = jest.fn();
    const { rerender } = render(<ProvincialSidebar setIsSidebarCollapsed={setIsSidebarCollapsed} />);

    await userEvent.click(screen.getByLabelText('Colapsar menú lateral'));
    expect(setIsSidebarCollapsed).toHaveBeenCalledWith(true);

    rerender(<ProvincialSidebar isSidebarCollapsed setIsSidebarCollapsed={setIsSidebarCollapsed} />);
    await userEvent.click(screen.getByLabelText('Expandir menú lateral'));
    expect(setIsSidebarCollapsed).toHaveBeenLastCalledWith(false);
  });

  test('colapsado oculta títulos y etiquetas de texto', () => {
    render(<ProvincialSidebar isSidebarCollapsed />);

    expect(screen.queryByRole('heading', { name: 'Gestión Territorial y Municipal' })).not.toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    expect(screen.getByTitle('Cerrar Sesión')).toBeInTheDocument();
  });

  test('el botón Cerrar Sesión abre el modal de verificación mediante setIsLogoutModalOpen', async () => {
    const setIsLogoutModalOpen = jest.fn();
    render(<ProvincialSidebar setIsLogoutModalOpen={setIsLogoutModalOpen} />);

    await userEvent.click(screen.getByRole('button', { name: /Cerrar Sesión/ }));

    expect(setIsLogoutModalOpen).toHaveBeenCalledWith(true);
  });

  test('en móvil abierto muestra el botón cerrar y el backdrop cierra el drawer', async () => {
    const setIsMobileOpen = jest.fn();
    const { container } = render(<ProvincialSidebar isMobileOpen setIsMobileOpen={setIsMobileOpen} />);

    await userEvent.click(screen.getByLabelText('Cerrar menú lateral'));
    await userEvent.click(container.querySelector('[aria-hidden="true"].fixed'));

    expect(setIsMobileOpen).toHaveBeenCalledTimes(2);
    expect(setIsMobileOpen).toHaveBeenCalledWith(false);
  });

  test('sin usuario usa valores por defecto (Puntarenas y avatar "G")', () => {
    useAuth.mockReturnValue({ user: null });

    render(<ProvincialSidebar />);

    expect(screen.getByText('JURISDICCIÓN: PUNTARENAS')).toBeInTheDocument();
    expect(screen.getByText('Coordinación Puntarenas')).toBeInTheDocument();
    expect(screen.getByText('G')).toBeInTheDocument();
  });

  test('activeTheme.nombre tiene prioridad sobre la provincia del usuario', () => {
    render(<ProvincialSidebar activeTheme={{ nombre: 'Limón', primary: '#349E35' }} />);

    expect(screen.getByText('JURISDICCIÓN: LIMÓN')).toBeInTheDocument();
  });
});
