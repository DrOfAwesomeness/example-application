import React from 'react';
import { useQuery, gql, useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import ButtonWithComponent from '../ButtonWithComponent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const ORDER_QUERY = gql`
  query GetOrder($id: Int!) {
    order(id: $id) {
      status
      totalPrice
    }
  }
`;

type OrderQueryResult = {
  order: {
    status: 'UNPAID' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
  }
}

const OrderSuccess: React.FC = () => {
  const params = useParams();
  const { loading, error, data, startPolling, stopPolling } = useQuery<OrderQueryResult>(ORDER_QUERY, {
    variables: {
      id: parseInt(params.orderId!, 10)
    },
  });
  if (loading) {
    return <CircularProgress />;
  } else if (error) {
    return <span>{error.message}</span>;
  } else if (!data) {
    return <span>No data</span>;
  }

  if (data.order.status === 'UNPAID') {
    startPolling(1000);
    return <CircularProgress />;
  } else if (data.order.status === 'CANCELLED') {
    return <Card sx={{ minWidth: 275, marginTop: 1 }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          Order Cancelled
        </Typography>
        <Typography variant='body2'>
          Your order has been cancelled.
        </Typography>
      </CardContent>
    </Card>;
  } else if (data.order.status === 'COMPLETED') {
    return (<Card sx={{ minWidth: 275, marginTop: 1 }}>
      <CardContent>
        <Typography variant='h5' component='div'>
          Order Completed
        </Typography>
        <Typography variant='body2'>
          Thank you for your order! We'll see you soon!
        </Typography>
        <ButtonWithComponent color='error' component={Link} to={`/order/${params.orderId}/cancel`}>Cancel</ButtonWithComponent>
      </CardContent>
    </Card>);
  }
}

export default OrderSuccess;