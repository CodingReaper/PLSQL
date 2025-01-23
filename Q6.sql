SELECT d.NAME, d.SALARY, d.DEPT_ID
FROM department d
JOIN (
    SELECT DEPT_ID, MAX(SALARY) AS MAX_SALARY
    FROM department
    GROUP BY DEPT_ID
) max_salaries
ON d.DEPT_ID = max_salaries.DEPT_ID
AND d.SALARY = max_salaries.MAX_SALARY;