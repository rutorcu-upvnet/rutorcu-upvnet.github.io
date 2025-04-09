import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configura tu proyecto
const supabaseUrl = 'https://azclkucymxcspaquhwmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Y2xrdWN5bXhjc3BhcXVod212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4NTQsImV4cCI6MjA1OTcwNDg1NH0.XFUAsD6cUJ9_6gSGHL2rFuAiiJnmv8KXSniFrBkzNnI'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
    const [componentes, setComponentes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const fetchComponentes = async () => {
            const { data, error } = await supabase.from("componentes").select();
            if (error) console.error(error);
            else setComponentes(data);
        };
        fetchComponentes();
    }, []);

    const sortedComponentes = [...componentes].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <h1>Componentes</h1>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('fecha')}>Fecha</th>
                        <th onClick={() => requestSort('tipo')}>Tipo</th>
                        <th onClick={() => requestSort('valor')}>Valor</th>
                        <th>Huella</th>
                        <th>Referencia</th>
                        <th>Distribuidor</th>
                        <th>Descripción</th>
                        <th>Unidades</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedComponentes.map((componente, index) => (
                        <tr key={index}>
                            <td>{new Date(componente.fecha).toLocaleString()}</td>
                            <td>{componente.tipo}</td>
                            <td>{componente.valor}</td>
                            <td>{componente.huella}</td>
                            <td>{componente.referencia}</td>
                            <td>{componente.distribuidor}</td>
                            <td>{componente.descripcion}</td>
                            <td>{componente.unidades}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
