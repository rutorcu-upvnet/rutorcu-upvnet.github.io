import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configura tu proyecto
const supabaseUrl = 'https://azclkucymxcspaquhwmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Y2xrdWN5bXhjc3BhcXVod212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4NTQsImV4cCI6MjA1OTcwNDg1NH0.XFUAsD6cUJ9_6gSGHL2rFuAiiJnmv8KXSniFrBkzNnI'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
    const [componentes, setComponentes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});
    const [newComponente, setNewComponente] = useState({
        tipo: '',
        valor: '',
        huella: '',
        referencia: '',
        distribuidor: '',
        descripcion: '',
        unidades: '',
        proyecto: ''
    });
    const [message, setMessage] = useState(''); // Nuevo estado para mensajes

    useEffect(() => {
        const fetchComponentes = async () => {
            const { data, error } = await supabase.from("componentes").select()
            if (error) console.error(error)
            else setComponentes(data)
        }
        fetchComponentes()
    }, [])

    const requestSort = (key) => {
        let direction = 'asc'
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc'
        }
        setSortConfig({ key, direction })
    }

    const sortedComponentes = [...componentes].sort((a, b) => {
        if (!sortConfig.key) return 0
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
    })

    const filteredComponentes = sortedComponentes.filter((comp) =>
        Object.entries(filters).every(([key, value]) =>
            !value || (comp[key]?.toString().toLowerCase().includes(value.toLowerCase()))
        )
    )

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComponente({
            ...newComponente,
            [name]: name === 'unidades' ? parseInt(value, 10) || '' : value
        });
    }

    const handleAddComponente = async (e) => {
        e.preventDefault();

        const componenteConId = {
            ...newComponente
        };

        const { data, error } = await supabase.from("componentes").insert([componenteConId]);
        if (error) {
            setMessage(`Error al agregar el componente: ${error.message}`); // Mostrar mensaje de error
        } else {
            setComponentes([...componentes, ...data]);
            setNewComponente({
                tipo: '',
                valor: '',
                huella: '',
                referencia: '',
                distribuidor: '',
                descripcion: '',
                unidades: '',
                proyecto: ''
            }); // Limpiar formulario
            setMessage('Componente agregado exitosamente.'); // Mostrar mensaje de éxito
        }

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div>
            <h2>Nuevos Componentes</h2>
            {message && <p>{message}</p>} {/* Mostrar mensaje */}
            <form onSubmit={handleAddComponente}>
                <input type="text" name="tipo" placeholder="Tipo" value={newComponente.tipo} onChange={handleInputChange} />
                <input type="text" name="valor" placeholder="Valor" value={newComponente.valor} onChange={handleInputChange} />
                <input type="text" name="huella" placeholder="Huella" value={newComponente.huella} onChange={handleInputChange} />
                <input type="text" name="referencia" placeholder="Referencia" value={newComponente.referencia} onChange={handleInputChange} />
                <input type="text" name="distribuidor" placeholder="Distribuidor" value={newComponente.distribuidor} onChange={handleInputChange} />
                <input type="text" name="descripcion" placeholder="Descripción" value={newComponente.descripcion} onChange={handleInputChange} />
                <input type="number" name="unidades" placeholder="Unidades" value={newComponente.unidades} onChange={handleInputChange} />
                <input type="text" name="proyecto" placeholder="Proyecto" value={newComponente.proyecto} onChange={handleInputChange} />
                <br />
                <button type="submit">Agregar Componente</button>
            </form>
            <h2>Componentes en stock</h2>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('tipo')}>Tipo</th>
                        <th onClick={() => requestSort('valor')}>Valor</th>
                        <th onClick={() => requestSort('huella')}>Huella</th>
                        <th onClick={() => requestSort('referencia')}>Referencia</th>
                        <th onClick={() => requestSort('distribuidor')}>Distribuidor</th>
                        <th onClick={() => requestSort('descripcion')}>Descripción</th>
                        <th onClick={() => requestSort('unidades')}>Unidades</th>
                        <th onClick={() => requestSort('proyecto')}>Proyecto</th>
                    </tr>
                    <tr>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, tipo: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, valor: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, huella: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, referencia: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, distribuidor: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, descripcion: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, unidades: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, proyecto: e.target.value })} /></th>
                    </tr>
                </thead>
                <tbody>
                    {filteredComponentes.map((componente, index) => (
                        <tr key={index}>
                            <td>{componente.tipo}</td>
                            <td>{componente.valor}</td>
                            <td>{componente.huella}</td>
                            <td>{componente.referencia}</td>
                            <td>{componente.distribuidor}</td>
                            <td>{componente.descripcion}</td>
                            <td>{componente.unidades}</td>
                            <td>{componente.proyecto}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
