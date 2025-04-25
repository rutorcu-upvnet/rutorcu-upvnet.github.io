import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '@mui/icons-material/Delete'; // Importar el ícono de eliminación

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

        try {
            const randomId = Math.floor(Math.random() * 1000000000);

            const componenteConId = {
                ...newComponente,
                id: randomId,
            };

            console.log('Datos enviados a Supabase:', componenteConId);

            const { data, error } = await supabase.from("componentes").insert([componenteConId]);
            if (error) {
                console.error('Error al insertar el componente:', error);
                setMessage(`Error al agregar el componente: ${error.message}`);
            } else {
                console.log('Datos insertados:', data);
                setMessage('Componente agregado exitosamente.');

                // Recargar todos los componentes desde la base de datos
                const fetchComponentes = async () => {
                    const { data, error } = await supabase.from("componentes").select();
                    if (error) {
                        console.error('Error al cargar los componentes:', error);
                    } else {
                        setComponentes(data);
                    }
                };
                await fetchComponentes();

                // Reiniciar el formulario
                setNewComponente({
                    tipo: '',
                    valor: '',
                    huella: '',
                    referencia: '',
                    distribuidor: '',
                    descripcion: '',
                    unidades: '',
                    proyecto: ''
                });
            }
        } catch (err) {
            console.error('Excepción capturada:', err);
            setMessage('Ocurrió un error inesperado.');
        }

        setTimeout(() => setMessage(''), 5000);
    };

    const handleDeleteComponente = async (id) => {
        try {
            const { error } = await supabase.from("componentes").delete().eq("id", id);
            if (error) {
                console.error('Error al eliminar el componente:', error);
                setMessage(`Error al eliminar el componente: ${error.message}`);
            } else {
                setMessage('Componente eliminado exitosamente.');

                // Recargar todos los componentes desde la base de datos
                const fetchComponentes = async () => {
                    const { data, error } = await supabase.from("componentes").select();
                    if (error) {
                        console.error('Error al cargar los componentes:', error);
                    } else {
                        setComponentes(data);
                    }
                };
                await fetchComponentes();
            }
        } catch (err) {
            console.error('Excepción capturada:', err);
            setMessage('Ocurrió un error inesperado al eliminar el componente.');
        }

        // Ocultar el mensaje después de 5 segundos
        setTimeout(() => setMessage(''), 5000);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Nuevos Componentes</h2>
            {message && <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">{message}</div>}
            <form onSubmit={handleAddComponente}>
                <Grid container spacing={2}>
                    {/* Primera fila */}
                    <Grid item size={4}>
                        <TextField
                            label="Tipo"
                            name="tipo"
                            value={newComponente.tipo}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            label="Valor"
                            name="valor"
                            value={newComponente.valor}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            label="Huella"
                            name="huella"
                            value={newComponente.huella}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    <Grid item size={4}>
                        <TextField
                            label="Referencia"
                            name="referencia"
                            value={newComponente.referencia}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            label="Distribuidor"
                            name="distribuidor"
                            value={newComponente.distribuidor}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>
                    <Grid item size={4}>
                        <TextField
                            label="Unidades"
                            name="unidades"
                            value={newComponente.unidades}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    <Grid item size={12}>
                        <TextField
                            label="Descripción"
                            name="descripcion"
                            value={newComponente.descripcion}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={3}
                        />
                    </Grid>

                    <Grid item size={6}>
                        <TextField
                            label="Proyecto"
                            name="proyecto"
                            value={newComponente.proyecto}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </Grid>

                    <Grid item size={6}>
                    </Grid>

                    <Grid item size={9}>
                    </Grid>

                    <Grid item size={3}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Agregar Componente
                        </Button>
                    </Grid>
                </Grid>
            </form>
            <h2>Componentes en stock</h2>
            <div className="table-responsive">
                <Table style={{ tableLayout: 'auto', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('tipo')}>Tipo <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('valor')}>Valor <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('huella')}>Huella <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('referencia')}>Referencia <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('distribuidor')}>Distribuidor <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('descripcion')}>Descripción <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('unidades')}>Unidades <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }} onClick={() => requestSort('proyecto')}>Proyecto <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell style={{ whiteSpace: 'nowrap' }}>Acciones</TableCell> {/* Nueva columna */}
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    label="Filtrar Tipo"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Valor"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, valor: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Huella"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, huella: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Referencia"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, referencia: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Distribuidor"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, distribuidor: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Descripción"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, descripcion: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Unidades"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, unidades: e.target.value })}
                                />
                            </TableCell>
                            <TableCell>
                                <TextField
                                    label="Filtrar Proyecto"
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => setFilters({ ...filters, proyecto: e.target.value })}
                                />
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredComponentes.map((componente, index) => (
                            <TableRow key={index}>
                                <TableCell>{componente.tipo}</TableCell>
                                <TableCell>{componente.valor}</TableCell>
                                <TableCell>{componente.huella}</TableCell>
                                <TableCell>{componente.referencia}</TableCell>
                                <TableCell>{componente.distribuidor}</TableCell>
                                <TableCell>{componente.descripcion}</TableCell>
                                <TableCell>{componente.unidades}</TableCell>
                                <TableCell>{componente.proyecto}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={() => handleDeleteComponente(componente.id)}
                                        style={{ backgroundColor: 'red', color: 'white' }} // Color rojo personalizado
                                    >
                                        <DeleteIcon /> {/* Ícono de eliminación */}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default App;
