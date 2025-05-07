import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add'; // Importar el ícono de Material-UI

// Configuración de Supabase
const supabaseUrl = 'https://azclkucymxcspaquhwmv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6Y2xrdWN5bXhjc3BhcXVod212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMjg4NTQsImV4cCI6MjA1OTcwNDg1NH0.XFUAsD6cUJ9_6gSGHL2rFuAiiJnmv8KXSniFrBkzNnI'
const supabase = createClient(supabaseUrl, supabaseKey);

// Constantes
const MESSAGE_TIMEOUT = 5000;

function App() {
    const [componentes, setComponentes] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({});
    const [showForm, setShowForm] = useState(false); // Estado para controlar la visibilidad del formulario
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
    const [message, setMessage] = useState('');

    // Función para cargar componentes desde la base de datos
    const fetchComponentes = useCallback(async () => {
        try {
            const { data, error } = await supabase.from('componentes').select();
            if (error) throw error;
            setComponentes(data);
        } catch (err) {
            console.error('Error al cargar los componentes:', err);
            setMessage('Error al cargar los componentes.');
        }
    }, []);

    useEffect(() => {
        fetchComponentes();
    }, [fetchComponentes]);

    // Función para manejar el ordenamiento
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedComponentes = [...componentes].sort((a, b) => {
        if (!sortConfig.key) return 0;
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const filteredComponentes = sortedComponentes.filter((comp) =>
        Object.entries(filters).every(([key, value]) =>
            !value || (comp[key]?.toString().toLowerCase().includes(value.toLowerCase()))
        )
    );

    // Función para alternar la visibilidad del formulario
    const toggleForm = () => {
        setShowForm((prev) => !prev);
    };

    // Función para manejar cambios en el formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewComponente({
            ...newComponente,
            [name]: name === 'unidades' ? parseInt(value, 10) || '' : value
        });
    };

    // Función para agregar un nuevo componente
    const handleAddComponente = async (e) => {
        e.preventDefault();

        try {
            const randomId = Math.floor(Math.random() * 1000000000);
            const componenteConId = { ...newComponente, id: randomId };

            const { error } = await supabase.from('componentes').insert([componenteConId]);
            if (error) throw error;

            setMessage('Componente agregado exitosamente.');
            fetchComponentes(); // Recargar componentes
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
            setShowForm(false); // Ocultar el formulario después de agregar el componente
        } catch (err) {
            console.error('Error al agregar el componente:', err);
            setMessage('Error al agregar el componente.');
        }

        setTimeout(() => setMessage(''), MESSAGE_TIMEOUT);
    };

    // Función para eliminar un componente
    const handleDeleteComponente = async (id) => {
        const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este componente?');
        if (!confirmDelete) return;

        try {
            const { error } = await supabase.from('componentes').delete().eq('id', id);
            if (error) throw error;

            setMessage('Componente eliminado exitosamente.');
            fetchComponentes(); // Recargar componentes
        } catch (err) {
            console.error('Error al eliminar el componente:', err);
            setMessage('Error al eliminar el componente.');
        }

        setTimeout(() => setMessage(''), MESSAGE_TIMEOUT);
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Nuevos Componentes</h2>
            {message && (
                <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`} role="alert">
                    {message}
                </div>
            )}

            {/* Botón para mostrar/ocultar el formulario */}
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={toggleForm}
                style={{ marginBottom: '20px' }}
            >
                {showForm ? 'Cancelar' : 'Agregar Componente'}
            </Button>

            {/* Formulario visible solo si showForm es true */}
            {showForm && (
                <form onSubmit={handleAddComponente}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Tipo"
                                name="tipo"
                                value={newComponente.tipo}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Valor"
                                name="valor"
                                value={newComponente.valor}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Huella"
                                name="huella"
                                value={newComponente.huella}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Referencia"
                                name="referencia"
                                value={newComponente.referencia}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Distribuidor"
                                name="distribuidor"
                                value={newComponente.distribuidor}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <TextField
                                label="Unidades"
                                name="unidades"
                                value={newComponente.unidades}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                        <Grid item xs={12}>
                            <TextField
                                label="Proyecto"
                                name="proyecto"
                                value={newComponente.proyecto}
                                onChange={handleInputChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Agregar Componente
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}

            <h2>Componentes en stock</h2>
            <div className="table-responsive">
                <Table style={{ tableLayout: 'auto', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={() => requestSort('tipo')}>Tipo <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('valor')}>Valor <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('huella')}>Huella <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('referencia')}>Referencia <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('distribuidor')}>Distribuidor <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('descripcion')}>Descripción <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('unidades')}>Unidades <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell onClick={() => requestSort('proyecto')}>Proyecto <FontAwesomeIcon icon={faSort} /></TableCell>
                            <TableCell> </TableCell>
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
                                        style={{ backgroundColor: 'red', color: 'white' }}
                                    >
                                        <DeleteIcon />
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
