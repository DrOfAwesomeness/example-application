import StripeClient from 'stripe';
import config from './config';
export default new StripeClient(config.stripeApiKey, {apiVersion: '2020-08-27'});