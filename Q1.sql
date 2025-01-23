CREATE OR REPLACE PROCEDURE insert_customer(
   p_id      IN NUMBER,
   p_name    IN VARCHAR2,
   p_age     IN NUMBER,
   p_address IN CHAR,
   p_salary  IN NUMBER
) 
IS
BEGIN
   INSERT INTO customers (ID, NAME, AGE, ADDRESS, SALARY)
   VALUES (p_id, p_name, p_age, p_address, p_salary);
EXCEPTION
   WHEN OTHERS THEN
       DBMS_OUTPUT.PUT_LINE('Error: ' || SQLERRM);
END insert_customer;
/
