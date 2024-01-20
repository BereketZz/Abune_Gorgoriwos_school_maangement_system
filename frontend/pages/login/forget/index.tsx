import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import { Card, styled } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Light from '@/layouts/SidebarLayout/Header/Buttons/Mode/light';


const ButtonSearch = styled(Button)(
  ({ theme }) => `
    margin-right: -${theme.spacing(1)};
`
);
const OverviewWrapper = styled(Box)(
  ({ theme }) => `
    overflow: auto;
    background: ${theme.palette.common.white};
    flex: 1;
    overflow-x: hidden;
`
);

const HeaderWrapper = styled(Card)(
  ({ theme }) => `
  width: 100%;
  display: flex;
  align-items: center;
  height: ${theme.spacing(10)};
  margin-bottom: ${theme.spacing(10)};
`
);
export default function SignIn() {
  const StyledInput = styled(TextField)`
  width: 100%;
  & .MuiOutlinedInput-notchedOutline {
    border-color: red;
  }
  & .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
    border-color: orange;
  }
`;
  // const { token, setToken } = useAppContext();

  const router = useRouter();
 

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async (values) => {
      try {
      
        const response = await axios.post(
          'http://localhost:3333/auth/forget',
          formik.values
        );

        const info = response.data.msg;
        console.log('Form submitted successfully!', response);

        toast.success(info)
      } catch (error) {
        // Handle error (e.g., display error message)
        console.error('Error submitting form:', error.response.data.message);
        toast.error(error.response.data.message);
       
      }
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .email('Must be a valid email')
        .required('Email is required'),
      
    })
  });
  return (

    <OverviewWrapper >
   
      <HeaderWrapper>
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center">
         < Link href="/" style={{textDecoration:"none",color:"green" }}>
           <img src='/abb.png' width={100} height={100}/>
           </Link>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flex={1}
            >
              <Box />
              <Box display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={3}
              >
        
                    <Link href="/" style={{textDecoration:"none",color:"green" }}>
                      <span>

                       Home
                      </span>
                    
                      </Link>
                      <Light/>
                    
                    
              </Box>
            </Box>
          </Box>
        </Container>
      </HeaderWrapper>
   
      
       
           <Container component="main" maxWidth="xs">
            <CssBaseline />
             <Box
              sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'green' }}>
                <LockOutlinedIcon  />
              </Avatar>
              <Typography component="h1" variant="h5">
                Forget Password
                
              </Typography>
              <Box
                component="form"
                onSubmit={formik.handleSubmit}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                
                  id="email"
                  label="Email Address"
                  name="email"
                  color='info'
                  autoFocus
                  focused 
                  
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                 
                />
                {formik.errors.email && <span  style={{color:"red"}} className='text-red-600'>{formik.errors.email}</span>}
                
            

                <ButtonSearch
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                 Reset
                </ButtonSearch>
                
                  <Grid item xs>
          
                  
                  </Grid>
                  <Grid item>
                    
                  </Grid>
               
              </Box>
            </Box>
            {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
          </Container>
          <ToastContainer
position="bottom-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
     
     
    </OverviewWrapper>
   
  );
}
