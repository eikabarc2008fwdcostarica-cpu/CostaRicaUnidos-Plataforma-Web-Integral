import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { useAuth } from '../../context/AuthContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
  PROVINCIAS_COSTA_RICA: [
    { id: '1', nombre: 'San José', cantonesCount: 20 },
    { id: '6', nombre: 'Puntarenas', cantonesCount: 13 },
  ],
}));

jest.mock('../common/Logo', () => ({
  __esModule: true,
  default: () => <span data-testid="logo" />,
  Isotipo: () => <span data-testid="isotipo" />,
}));

jest.mock('../common/CNEGlobalMarqueeAlert', () => ({
  __esModule: true,
  default: () => <div data-testid="cne-marquee" />,
}));

const gestor = { nombre: 'Marta Rojas', correo: 'marta@cru.cr', rol: 'GESTOR_TERRITORIAL', nivelAcceso: 4 };
const superAdmin = { nombre: 'Ana Admin', correo: 'ana@cru.cr', rol: 'SUPER_ADMIN_NACIONAL', nivelAcceso: 5 };

const renderNavbar = (props = {}) =>
  render(
    <MemoryRouter>
      <AdminNavbar
        activeTheme={{ nombre: 'Puntarenas', primary: '#F36717', glow: 'rgba(0,0,0,.4)', cantonesCount: 13 }}
        selectedProvId="6"
        setSelectedProvId={jest.fn()}
        currentTime={new Date('2026-10-07T12:00:00Z')}
        formatHoraCST={() => '06:00:00'}
        {...props}
      />
    </MemoryRouter>
  );

describe('AdminNavbar', () => {
  let logout;

  beforeEach(() => {
    jest.clearAllMocks();
    logout = jest.fn();
    useAuth.mockReturnValue({ user: gestor, logout });
  });

  test('muestra la marca, el nivel de gestor, la jurisdicción fija y el reloj CST', () => {
    // Arrange + Act
    renderNavbar();

    // Assert
    expect(screen.getByText('Costa Rica Unidos')).toBeInTheDocument();
    expect(screen.getByText(/\[NIVEL 4\] GESTOR TERRITORIAL Y MUNICIPAL/)).toBeInTheDocument();
    expect(screen.getByText(/JURISDICCIÓN ASIGNADA: PUNTARENAS • 13 CANTONES/)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Theming/)).not.toBeInTheDocument();
    expect(screen.getByText('06:00:00')).toBeInTheDocument();
    expect(screen.getByTestId('cne-marquee')).toBeInTheDocument();
  });

  test('muestra "--:--:--" cuando no hay hora actual', () => {
    renderNavbar({ currentTime: null });

    expect(screen.getByText('--:--:--')).toBeInTheDocument();
  });

  test('el super admin ve el selector de provincia y puede cambiarla', async () => {
    // Arrange
    useAuth.mockReturnValue({ user: superAdmin, logout });
    const setSelectedProvId = jest.fn();
    renderNavbar({ setSelectedProvId });

    // Act
    await userEvent.selectOptions(screen.getByLabelText('Theming:'), '1');

    // Assert
    expect(screen.getByText(/\[NIVEL 5\] SUPER ADMIN NACIONAL/)).toBeInTheDocument();
    expect(setSelectedProvId).toHaveBeenCalledWith('1');
    expect(screen.getByRole('button', { name: /Volver a Mando Nacional/ })).toBeInTheDocument();
  });

  test('los botones Portal y GIS 3D navegan a su ruta', async () => {
    renderNavbar();

    await userEvent.click(screen.getByRole('button', { name: /Portal/ }));
    await userEvent.click(screen.getByRole('button', { name: /GIS 3D/ }));

    expect(mockNavigate).toHaveBeenNthCalledWith(1, '/portal-ciudadano');
    expect(mockNavigate).toHaveBeenNthCalledWith(2, '/mapa-gis');
  });

  test('el botón hamburguesa solo aparece con onToggleMobileSidebar y lo invoca', async () => {
    const onToggle = jest.fn();
    const { unmount } = renderNavbar();
    expect(screen.queryByLabelText('Abrir menú de navegación')).not.toBeInTheDocument();
    unmount();

    renderNavbar({ onToggleMobileSidebar: onToggle });
    await userEvent.click(screen.getByLabelText('Abrir menú de navegación'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  test('cerrar sesión exige confirmación: abre el modal, confirma y redirige a /login', async () => {
    // Arrange
    renderNavbar();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Act
    await userEvent.click(screen.getByTitle('Cerrar sesión activa'));

    // Assert: modal visible con datos del usuario
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveTextContent('¿Confirmar Cierre de Sesión?');
    expect(dialog).toHaveTextContent('Marta Rojas');
    expect(logout).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: /Confirmar Salida/ }));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('cancelar el cierre de sesión cierra el modal sin llamar a logout', async () => {
    renderNavbar();
    await userEvent.click(screen.getByTitle('Cerrar sesión activa'));

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(logout).not.toHaveBeenCalled();
  });

  test('Escape cierra el modal de cierre de sesión', async () => {
    renderNavbar();
    await userEvent.click(screen.getByTitle('Cerrar sesión activa'));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
