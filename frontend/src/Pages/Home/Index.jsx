import './style.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const SignupSchema = Yup.object().shape({
  ID: Yup.string().required("Campo Obrigario"),
  Email: Yup.string().email("Email invalido").required("Campo Obrigario"),
  Salary: Yup.number().required("Campo Obrigario"),
});

const formCreate = Yup.object().shape({
  Name: Yup.string()
    .min(2, "Nome muito curto")
    .max(50, "Somente Primeiro Nome")
    .required("Campo Obrigario"),
  Document: Yup.string()
    .min(11, "CPF muito curto")
    .max(11, "CPF muito Longo!")
    .required("Campo Obrigario"),
  Email: Yup.string().email("Email invalido").required("Campo Obrigario"),
  Birth_date: Yup.date().required("Required").min(new Date("1900-01-01")),
  Salary: Yup.number().required("Campo Obrigario"),
})

function App() {
  
  const [data, setData] = useState([null]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [idEdit, setIdEdit] = useState(0);
  const rows = data;
  
  const deleteUser = (id) => {
    fetch(`http://localhost:3001/api/deleteworker/${id}`, {
        method: 'DELETE',
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(response => {
        console.log('Success:', JSON.stringify(response));
        getWorkers()
    })
      .catch(error => console.error('Error:', error));
 } 

  const toggleModelCreate = () => {
    setOpenCreate(!openCreate);
  }
  const toggleModelEdit = (id) => {
    setOpenEdit(!openEdit);
    setIdEdit(id);
  }
   const getWorkers = () =>{
    fetch("http://localhost:3001/api/teste")
      .then((response) => {
        return response.json()
      })
      .then((res) => {
        setData(res.data)
        console.log(res.data)
      })
      .catch((error) => console.error(error));
   } 

  useEffect(() => {
    getWorkers()
  }, []);
  
  return (
    <div>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell align="right">Nome</TableCell>
            <TableCell align="right">cpf</TableCell>
            <TableCell align="right">E-mail</TableCell>
            <TableCell align="right">Data de Nascimento</TableCell>
            <TableCell align="right">Salario</TableCell>
            <TableCell align="right">Data de Contrataçao</TableCell>
            <TableCell align="right">Editar</TableCell>
            <TableCell align="right">Excluir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows ? rows.map((row) => (
            <TableRow
              key={row?.ID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row?.ID}
              </TableCell>
              <TableCell align="right">{row?.Name}</TableCell>
              <TableCell align="right">{row?.Document?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}</TableCell>
              <TableCell align="right">{row?.Email}</TableCell>
              <TableCell align="right">{row ? new Date(row?.Birth_date).toLocaleDateString() :""}</TableCell>
              <TableCell align="right">{row?.Salary}</TableCell>
              <TableCell align="right">{row ? new Date(row?.created_at).toLocaleDateString() :""}</TableCell>
              <TableCell align="right">
                <Button class="editar" onClick={(e)=>{
                  toggleModelEdit(row.ID)}}>
                    Editar</Button>
              </TableCell>
              <TableCell align="right">
                <Button class="delete" onClick={(e)=>{
                  deleteUser(row.ID)}}>Excluir</Button>
              </TableCell>
            </TableRow>
          )):[]}
        </TableBody>
      </Table>
    </TableContainer>
    <Button class="Add"onClick={toggleModelCreate}>Adicionar Funcionario</Button>
    <Modal
        open={openCreate}
        onClose={toggleModelCreate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <div>
    <h1>Cadastrar novo Funcionario</h1>
    <Formik
      initialValues={{
        Name: "",
        Document: "",
        Email: "",
        Birth_date: "",
        Salary: "",
      }}
      validationSchema={formCreate}
      onSubmit={(values) => {
        fetch("http://localhost:3001/api/insertworker", {
            method: 'POST',
            body: JSON.stringify(values),
            headers:{
              'Content-Type': 'application/json'
            }
          })
          .then(res => res.json())
          .then(response => console.log('Success:', JSON.stringify(response)))
          .catch(error => console.error('rror:', error));
          toggleModelCreate()
          getWorkers()
      }}
    >
      {({ errors, touched }) => (
        <Form class="modal" id="form">
        <label htmlFor="Name">Nome:</label>
          <Field name="Name" id="Name"/>
          {errors.Name && touched.Name ? <div>{errors.Name}</div> : null}
          
          <label htmlFor="Document">CPF:</label>
          <Field name="Document" id="Document"/>
          {errors.Document && touched.Document ? (
            <div>{errors.Document}</div>
          ) : null}
          
          <label htmlFor="Email">E-mail:</label>
          <Field name="Email" type="Email" id="Email"/>
          {errors.Email && touched.Email ? <div>{errors.Email}</div> : null}
          
          <label htmlFor="Birth_date">Data de Nascimento:</label>
          <Field type="date" name="Birth_date" id="Birth_date"/>
          {errors.Birth_date && touched.Birth_date ? (
            <div>{errors.Birth_date}</div>
          ) : null}
          
          <label htmlFor="Salary">Salario:</label>
          <Field name="Salary" id="Salary"/>
          {errors.Salary && touched.Salary ? <div>{errors.Salary}</div> : null}
         
          <button  type="submit">Enviar</button>
        </Form>
      )}
    </Formik>
  </div>
        </Box>
      </Modal>
      <Modal
        open={openEdit}
        onClose={toggleModelEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div>
  <h1>Editar Funcionario</h1>
  <Formik
    initialValues={{
      ID: idEdit,
      Email: "",
      Salary: "",
    }}
    validationSchema={SignupSchema}
    onSubmit={(values) => {
      fetch("http://localhost:3001/api/updateworker", {
        method: 'PUT',
        body: JSON.stringify(values),
        headers:{
          'Content-Type': 'application/json'
        }
      })
      .then(res => res.json())
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
      toggleModelEdit()
      getWorkers()
    }
  }
  >
    {({ errors, touched }) => (
      <Form class="modal">
        
        <label htmlFor="Email">E-mail:</label>
        <Field name="Email" type="Email" id="Email"/>
        {errors.Email && touched.Email ? <div>{errors.Email}</div> : null}
        <label htmlFor="Salary">Salario:</label>
        <Field name="Salary" id="Salary"/>
        {errors.Salary && touched.Salary ? <div>{errors.Salary}</div> : null}
       
        <button type="submit">Enviar</button>
      </Form>
    )}
  </Formik>
</div>
        </Box>
      </Modal>
    </div>
  );
}

export default App
