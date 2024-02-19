// import mongoose from 'mongoose';
import connectDB from '@/utils/db';
import CowMilkQuality from '@/models/CowMilkQuality';

connectDB();


export default async function handler(req, res) {

    switch (req.method) {
      case 'GET':
        if (req.query.id){
          try {
            const cowMilkQuality = await CowMilkQuality.findById(req.query.id);
            await cowMilkQuality.populate(['cowId'])
            res.status(200).json(cowMilkQuality);
          } catch (error) {
            // console.error(error);
            res.status(404).send('CowMilkQuality not found');
          }
  
        } else {
        try {
          // console.log("Hello World")
          const page = parseInt(req.query.page) || 1;
          const pageSize = parseInt(req.query.pageSize) || 10;
          let query = {}; 
  
          const totalCount = await CowMilkQuality.countDocuments(query);
          const totalPages = Math.ceil(totalCount / pageSize);
  
          const cowMilkQualitys = await CowMilkQuality.find(query)
              .skip((page - 1) * pageSize)
              .populate(["cowId"])
              .limit(pageSize);
  
              res.json({
              cowMilkQualitys,
              page,
              pageSize,
              totalCount,
              totalPages,
        });
        
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
        }
        break;
      case 'POST':
        try {
          const newCowMilkQuality = new CowMilkQuality(req.body);
          const savedCowMilkQuality = await newCowMilkQuality.save();
          await savedCowMilkQuality.populate(['cowId',])
  
          res.status(201).json(savedCowMilkQuality);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
        res.status(500).send('Provide a valid query');
        break;
      
      case 'PUT':
          try {
            const { id, ...updatedData } = req.body;
            const updatedCowMilkQuality = await CowMilkQuality.findByIdAndUpdate(id, updatedData, { new: true });
            await updatedCowMilkQuality.populate(['cowId',])
            res.status(200).json(updatedCowMilkQuality);
          } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
          }
          break;
  
      case 'DELETE':
        try {
          const { id } = req.body;
          let deletedCowMilkQuality = await User.findByIdAndDelete(id);
          // console.log("sdnfkandjka", deletedCowMilkQuality)
          res.status(200).send({
            "message":"deleted successfully",
            deletedCowMilkQuality
          });
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
        break;
  
      default:
        res.status(405).send('Method Not Allowed');
    }
  }
  