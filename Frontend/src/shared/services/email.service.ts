import emailjs from '@emailjs/browser';
import { environment } from '../../environments/environment.prod';

export function sendOrderEmail(orderData: any) {
    const serviceID = environment.emailjsServiceId;
    const templateID = environment.emailjsTemplateId;
    const publicKey = environment.emailjsPublicKey;
  
    return emailjs.send(serviceID, templateID, orderData, publicKey);
  }

  export function sendOrderCompletedEmail(orderData: any) {
    const serviceID = environment.emailjsServiceId;
    const templateID = environment.emailjsTemplateIdCompleted;
    const publicKey = environment.emailjsPublicKey;
  
    return emailjs.send(serviceID, templateID, orderData, publicKey);
  }
