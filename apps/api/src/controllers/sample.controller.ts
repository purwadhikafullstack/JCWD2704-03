// import { Request, Response } from 'express';
// import prisma from '@/libs/prisma';

// export class SampleController {
//   async getSampleData(req: Request, res: Response) {
//     const sampleData = await prisma.user.findMany();

//     return res.status(200).send(sampleData);
//   }

//   async getSampleDataById(req: Request, res: Response) {
//     const { id } = req.params;

//     // if (!sample) {
//     //   return res.send(404);
//     // }

//     // return res.status(200).send(sample);
//   }

//   async createSampleData(req: Request, res: Response) {
//     const { last_name, first_name, email, role } = req.body;

//     const newSampleData = await prisma.user.create({
//       data: { last_name, first_name, email, role },
//     });

//     return res.status(201).send(newSampleData);
//   }
// }
