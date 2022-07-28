import React, { useState } from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
    }
  }
`;

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
};

type ProductsQueryResponse = {
  products: Product[];
};

const PURCHASE_MUTATION = gql`
  mutation PurchaseItem($productId: Int!, $customerName: String!, $customerEmail: String!) {
    purchaseProduct(input: {productId: $productId, customerName: $customerName, customerEmail: $customerEmail}) {
      paymentUrl
    }
  }
`;

type PurchaseMutationVariables = {
  productId: number;
  customerName: string;
  customerEmail: string;
}

type PurchaseMutationResult = {
  purchaseProduct: {
    paymentUrl: string;
  }
}

const emailRegex = /^\S+@\S+\.\S+$/;

const ProductCard: React.FC<{product: Product}> = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogLocked, setDialogLocked] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerNameError, setCustomerNameError] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerEmailError, setCustomerEmailError] = useState(false);

  const [doPurchase, purchaseResult] = useMutation<PurchaseMutationResult, PurchaseMutationVariables>(PURCHASE_MUTATION);

  const validateCustomerName = (value: string) => {
    if (value.length < 1) {
      setCustomerNameError(true);
      return true;
    }
    setCustomerNameError(false);
    return false;
  }

  const validateCustomerEmail = (value: string) => {
    if (value.match(emailRegex) === null) {
      setCustomerEmailError(true);
      return true;
    } else {
      setCustomerEmailError(false);
      return false;
    }
  }

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(e.target.value);
    validateCustomerName(e.target.value);
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerEmail(e.target.value);
    validateCustomerEmail(e.target.value);
  }

  const submitOrder = () => {
    if (!validateCustomerName(customerName) && !validateCustomerEmail(customerEmail)) {
      setDialogLocked(true);
      doPurchase({
        variables: {
          customerEmail,
          customerName,
          productId: props.product.id
        }
      })
    }
  }

  const closeDialog = () => {
    if (!dialogLocked) {
      setDialogOpen(false);
    }
  }

  if (purchaseResult.data) {
    window.location = purchaseResult.data.purchaseProduct.paymentUrl;
  } else if (purchaseResult.error) {
    alert(purchaseResult.error.message);
    setDialogLocked(false);
    setDialogOpen(false);
  }

  return (
    <React.Fragment>
      <Grid item>
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea onClick={() => setDialogOpen(true)}>
            <CardContent>
              <Typography variant='h5' component='div'>{props.product.name}</Typography>
              <Typography variant='body2'>{props.product.description}</Typography>
              <Typography variant='body2' color='text.secondary'>${(props.product.price / 100).toFixed(2)}</Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Order {props.product.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.product.description}</DialogContentText>
          <Typography variant='h5'>Total: ${(props.product.price / 100).toFixed(2)}</Typography>
          <TextField 
            autoFocus
            margin='dense'
            label='Your Name'
            variant='standard'
            value={customerName}
            onChange={onChangeName}
            fullWidth
            error={customerNameError}
            helperText={customerNameError ? 'Must be at least 1 character' : undefined}
          ></TextField>
          <TextField
            margin='dense'
            label='Email Address'
            variant='standard'
            value={customerEmail}
            onChange={onChangeEmail}
            fullWidth
            error={customerEmailError}
            helperText={customerEmailError ? 'Invalid email' : undefined}
         ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={submitOrder} disabled={dialogLocked}>Place Order</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

const ProductsPage: React.FC = () => {
  const { loading, error, data } = useQuery<ProductsQueryResponse>(PRODUCTS_QUERY);

  if (loading) {
    return <CircularProgress />
  } else if (error) {
    return <span>{error.message}</span>;
  } else if (!data) {
    return <span>No data</span>;
  }

  return <Grid container spacing={1} sx={{marginTop: 1}}>
    {
      data.products.map(product =>
        <ProductCard product={product} key={product.id} />
      )
    }
  </Grid>;
}

export default ProductsPage;