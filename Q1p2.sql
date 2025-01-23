DECLARE
    p_id      NUMBER;
    p_name    VARCHAR2(100);
    p_age     NUMBER;
    p_address CHAR(100);
    p_salary  NUMBER;
BEGIN
    FOR i IN 1..10 LOOP
        DBMS_OUTPUT.PUT_LINE('Enter details for record ' || i || ':');
        p_id := &id;
        p_name := '&name';
        p_age := &age;
        p_address := '&address';
        p_salary := &salary;
        insert_customer(p_id, p_name, p_age, p_address, p_salary);
        DBMS_OUTPUT.PUT_LINE('Record ' || i || ' inserted successfully.');
    END LOOP;
END;
/
