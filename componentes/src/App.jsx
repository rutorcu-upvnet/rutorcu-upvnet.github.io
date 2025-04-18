import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configura tu proyecto
const supabaseUrl = 'https://azclkucymxcspaquhwmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Y2xrdWN5bXhjc3BhcXVod212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4NTQsImV4cCI6MjA1OTcwNDg1NH0.XFUAsD6cUJ9_6gSGHL2rFuAiiJnmv8KXSniFrBkzNnI'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
    const [componentes, setComponentes] = useState([])
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
    const [filters, setFilters] = useState({})

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

    return (
        <div>
            <h1>Componentes</h1>
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
                    </tr>
                    <tr>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, tipo: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, valor: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, huella: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, referencia: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, distribuidor: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, descripcion: e.target.value })} /></th>
                        <th><input type="text" onChange={(e) => setFilters({ ...filters, unidades: e.target.value })} /></th>
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
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
