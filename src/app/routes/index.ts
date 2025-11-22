import express from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.route';
import { scheduleRoutes } from '../modules/schedules/schedule.route';
import { doctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { SpecialtiesRoutes } from '../modules/specialities/speciality.routes';
import { DoctorRoutes } from '../modules/doctor/doctor.routes';
import { AppointmentRoutes } from '../modules/appointments/appointment.routes';
import { PrescriptionRoutes } from '../modules/prescription/prescription.routes';
import { ReviewRoutes } from '../modules/review/review.routes';
import { PatientRoutes } from '../modules/patient/patient.routes';
import { MetaRoutes } from '../modules/meta/meta.routes';


const router = express.Router();

const moduleRoutes = [

       {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
       {
        path: '/auth',
        route: authRoutes
    },
       {
        path: '/schedule',
        route: scheduleRoutes
    },
       {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
        {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
        {
        path: '/doctor',
        route: DoctorRoutes
    },
        {
            path: '/appointment',
        route: AppointmentRoutes
    },
        {
            path: '/prescription',
        route: PrescriptionRoutes
    },

        {
            path: '/review',
        route: ReviewRoutes
    },
    {
        path: '/meta',
        route: MetaRoutes
    }
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;