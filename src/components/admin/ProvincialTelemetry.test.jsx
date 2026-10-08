import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProvincialTelemetry from './ProvincialTelemetry';

jest.mock('../../context/AuthContext', () => ({
  PROVINCIAS_COSTA_RICA: [{ id: '6', nombre: 'Puntarenas', cantonesCount: 13 }],
}));

const THEME = { primary: '#F36717', glow: 'rgba(243,103,23,.4)', nombre: 'Puntarenas' };

describe('ProvincialTelemetry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza el encabezado con el nombre de la provincia y el badge de tiempo real', () => {
    render(<ProvincialTelemetry provinciaTheme={THEME} />);

    expect(screen.getByRole('heading', { name: 'Telemetría y Rendimiento Territorial' })).toBeInTheDocument();
    expect(screen.getByText(/capacidad instalada en Puntarenas/)).toBeInTheDocument();
    expect(screen.getByText('MÉTRICAS CALCULADAS EN TIEMPO REAL')).toBeInTheDocument();
  });

  test('muestra los 4 KPIs calculados a partir de los datos cantonales', () => {
    render(<ProvincialTelemetry provinciaTheme={THEME} />);

    // Tasa de resolución: 164 solucionadas de 196 recibidas = 83.7 %
    expect(screen.getByText('Tasa de Resolución')).toBeInTheDocument();
    expect(screen.getByText(/83\.7/)).toBeInTheDocument();
    // Tiempo medio ponderado: 3.8 horas
    expect(screen.getByText('Tiempo Medio de Respuesta')).toBeInTheDocument();
    expect(screen.getByText(/3\.8/)).toBeInTheDocument();
    expect(screen.getByText('Cantón de Mayor Demanda')).toBeInTheDocument();
    expect(screen.getByText('Albergues y Refugio CNE')).toBeInTheDocument();
    expect(screen.getByText(/490/)).toBeInTheDocument();
  });

  test('la tabla comparativa lista los 13 cantones de Puntarenas ordenados por recibidas', () => {
    render(<ProvincialTelemetry provinciaTheme={THEME} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    expect(rows).toHaveLength(14); // encabezado + 13 cantones
    expect(within(rows[1]).getByText('Puntarenas (Central)')).toBeInTheDocument();
    expect(within(table).getByRole('columnheader', { name: 'Tasa Res.' })).toBeInTheDocument();
    expect(within(table).getByText('Puerto Jiménez')).toBeInTheDocument();
  });

  test('ordenar por "Activas" reordena la tabla por incidencias activas', async () => {
    render(<ProvincialTelemetry provinciaTheme={THEME} />);
    const rowsAntes = within(screen.getByRole('table')).getAllByRole('row');
    expect(within(rowsAntes[2]).getByText('Osa (Ciudad Cortés)')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Activas' }));

    const rows = within(screen.getByRole('table')).getAllByRole('row');
    expect(within(rows[1]).getByText('Puntarenas (Central)')).toBeInTheDocument();
    // Golfito (4 activas) debe subir al tercer lugar tras Puntarenas y Osa (7 activas)
    expect(within(rows[3]).getByText('Golfito')).toBeInTheDocument();
  });

  test('el selector de vista permite ocultar la tabla (solo barras) y volver a mostrarla', async () => {
    render(<ProvincialTelemetry provinciaTheme={THEME} />);
    expect(screen.getByRole('table')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Barras CSS/ }));
    expect(screen.queryByRole('table')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Ambas/i }));
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
