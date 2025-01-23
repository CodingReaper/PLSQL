DECLARE
   CURSOR high_salary_cursor IS
      SELECT ID, NAME, SALARY
      FROM (
         SELECT ID, NAME, SALARY
         FROM customers
         ORDER BY SALARY DESC
      )
      WHERE ROWNUM <= 5;

   id      customers.ID%TYPE;
   name    customers.NAME%TYPE;
   salary  customers.SALARY%TYPE;
BEGIN
   OPEN high_salary_cursor;
   LOOP
      FETCH high_salary_cursor INTO id, name, salary;
      EXIT WHEN high_salary_cursor%notfound;      
      DBMS_OUTPUT.PUT_LINE('ID: ' || id || ', Name: ' || name || ', Salary: ' || salary);
   END LOOP;
   CLOSE high_salary_cursor;
END;
/
