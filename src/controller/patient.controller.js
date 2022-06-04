import database from "../config/mysql.config.js";
import Response from "../domain/response.js";
import logger from "../util/logger.js";
import QUERY from "../query/patient.query.js";

const HttpStatus = {

    OK: {code:200  , status:" OK"} ,
    CREATED: {code:201  , status:" CREATED"},
    NO_CONTENT: {code:204  , status:" NO_CONTENT"},
    BAD_REQUEST: {code:400  , status:" BAD_REQUEST"},
    NOT_FOUND: {code: 404 , status:" NOT_FOUND"},
    INTERNAL_SERVER_ERROR: {code: 500  , status:" INTERNAL_SERVER_ERROR"},

}

export const getPatients = (req,res)=>{

    logger.info(`${req.method} ${req.orignalUrl},"fetching patients`);
    database.query(QUERY.SELECT_PATIENTS,(_error,results)=>{

        if(!results){
            res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code,HttpStatus.OK.status,`Patients Not Found`));

        }
        else{
            res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code,HttpStatus.OK.status,`Patients Retrieved`,{patients:results}));
        }
    });
};

export const createPatient = (req,res)=>{

    logger.info(`${req.method} ${req.orignalUrl},"creating patient`);
    database.query(QUERY.CREATE_PATIENT,Object.values(req.body),(error,results)=>{

        if(!results){
            logger.error(error.message);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.status,`Error Ocurred`));

        }
        else{
            const patient = {id:results.insertedId,...req.body,created_at:new Date()};
            res.status(HttpStatus.CREATED.code).send(new Response(HttpStatus.CREATED.code,HttpStatus.CREATED.status,`Patients Created`,{patient}));
        }
    });
};

export const getPatient = (req,res)=>{

    logger.info(`${req.method} ${req.orignalUrl},"fetching patient`);
    database.query(QUERY.SELECT_PATIENTS,[req.params.id],(_error,results)=>{

        if(!results[0]){
            res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.status,`Patient by id ${req.params.id}`));

        }
        else{
            res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code,HttpStatus.OK.status,`Patients Retrieved`,results[0]));
        }
    });
};

export const updatePatient = (req,res)=>{

    logger.info(`${req.method} ${req.orignalUrl},"fetching patient`);
    database.query(QUERY.SELECT_PATIENTS,[req.params.id],(_error,results)=>{

        if(!results[0]){
            res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.status,`Patient by id ${req.params.id}`));

        }
        else{
            logger.info(`${req.method} ${req.orignalUrl},"updating patient`);
            database.query(QUERY.UPDATE_PATIENT,[...Object.values(req.body),req.params.id],(error)=>{
              if(!error){
                res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code,HttpStatus.OK.status,`Patients Updated`,{id:req.params.id,...req.body}));
              } else{
                  logger.error(error.message);
                  res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.status,`Error Ocurred`));
              }
            });
          
        }
    });
};

export const deletePatient = (req,res)=>{

    logger.info(`${req.method} ${req.orignalUrl},"Deleting patient`);
    database.query(QUERY.DELETE_PATIENT,[req.params.id],(_error,results)=>{

        if(!results.affectedRows > 0){
            res.status(HttpStatus.OK.code).send(new Response(HttpStatus.OK.code,HttpStatus.OK.status,`Patients Deleted`,results[0]));
        }
        else{
            res.status(HttpStatus.NOT_FOUND.code).send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.status,`Patient by id ${req.params.id} was not found`));
        }
    });
};



export default HttpStatus;