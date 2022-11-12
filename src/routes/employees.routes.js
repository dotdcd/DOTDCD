import { Router } from "express";
import { addEmployee, uptEmployee} from "../controllers/employees/employees.controller.js";

const employeesRoutes = Router();

employeesRoutes.post('/addEmployee', addEmployee)
employeesRoutes.post('/updEmployee/:id', uptEmployee)

export default employeesRoutes;