import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Configura tu proyecto
const supabaseUrl = 'https://azclkucymxcspaquhwmv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Y2xrdWN5bXhjc3BhcXVod212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4NTQsImV4cCI6MjA1OTcwNDg1NH0.XFUAsD6cUJ9_6gSGHL2rFuAiiJnmv8KXSniFrBkzNnI'
const supabase = createClient(supabaseUrl, supabaseKey)

function App() {
    const [componentes, setComponentes] = useState([])
    const [filtros, setFiltros] = useState({
        tipo: '', valor: '', referencia: '', distribuidor: '', descripcion: ''
    })

    useEffect(() => {
        const fetchData = async () => {
            let { data, error } = await supabase
                .from('componentes')
                .select('*')
            if (error) console.error(error)
            else setComponentes(data)
        }

        fetchData()
    }, [])

    const filtrar = (fila) => {
        return Object.entries(filtros).every(([key, val]) =>
            fila[key]?.toLowerCase().includes(val.toLowerCase())
        )
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">Lista de Componentes</h1>
            <table className="border-collapse w-full border border-gray-400">
                <thead>
                    <tr>
                        {['tipo', 'valor', 'referencia', 'distribuidor', 'descripcion', 'unidades'].map(col => (
                            <th key={col} className="border p-2">
                                {col}
                                <br />
                                <input
                                    className="w-full border mt-1"
                                    value={filtros[col] || ''}
                                    onChange={(e) => setFiltros({ ...filtros, [col]: e.target.value })}
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {componentes.filter(filtrar).map((comp, idx) => (
                        <tr key={idx}>
                            <td className="border p-2">{comp.tipo}</td>
                            <td className="border p-2">{comp.valor}</td>
                            <td className="border p-2">{comp.referencia}</td>
                            <td className="border p-2">{comp.distribuidor}</td>
                            <td className="border p-2">{comp.descripcion}</td>
                            <td className="border p-2">{comp.unidades}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default App
