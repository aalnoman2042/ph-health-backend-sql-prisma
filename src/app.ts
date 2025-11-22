import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
import cookieParser from 'cookie-parser';
import { PaymentController } from './app/modules/Payment/payment.controller';
import cron from 'node-cron';
import { AppointmentService } from './app/modules/appointments/appointment.service';
import { AppointmentController } from './app/modules/appointments/appointments.controller';

const app: Application = express();

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }), // important for signature verification
  PaymentController.handleStripeWebhookEvent
);

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use("/api/v1", router)


app.get('/', (req: Request, res: Response) => {
    res.send({
        Message: "Ph health care server.."
    })
});

cron.schedule('* * * * *',  () => {
    try {
        AppointmentController.cancelUnpaidAppointments();
    } catch (error) {
        console.log(error);
        
    }
  
});


app.use(globalErrorHandler);

app.use(notFound);

export default app;