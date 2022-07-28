import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ButtonWithComponent from '../ButtonWithComponent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const CANCEL_MUTATION = gql`
  mutation CancelOrder($id: Int!) {
    cancelOrder(id: $id)
  }
`;

type CancelMutationResult = { cancelOrder: string; }

const OrderCancel = () => {
  const params = useParams();
  const orderId = parseInt(params.orderId!, 10);

  const [doCancel, {loading, error, data}] = useMutation<CancelMutationResult, {id: number}>(CANCEL_MUTATION);


  if (!loading && !error && !data) {
    doCancel({
      variables: {
        id: orderId
      }
    });
  }

  if (loading) {
    return <CircularProgress />;
  } else if (error) {
    return <span>{error.message}</span>;
  } else if (!data) {
    return <span>No data</span>;
  }

  return <Card sx={{ minWidth: 275, marginTop: 1 }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          Order Cancelled
        </Typography>
        <Typography variant='body2'>
          {data.cancelOrder}
        </Typography>
      </CardContent>
    </Card>;
};

export default OrderCancel;