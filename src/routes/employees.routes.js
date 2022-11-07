import { Router } from "express";
import { addEmployee } from "../controllers/employees/employees.controller.js";

const employeesRoutes = Router();

employeesRoutes.post('/addEmployee', addEmployee)

export default employeesRoutes;