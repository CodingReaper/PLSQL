SELECT e.NAME, e.SALARY, e.DEPT_ID
FROM employee_info e
JOIN employee_position p
ON e.ID = p.EMPLOYEE_ID
WHERE p.POSITION LIKE '%Manager%';

