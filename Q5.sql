DECLARE
    start_date   DATE;
    end_date     DATE;
    sats DATE;
    suns DATE;
BEGIN
    start_date := TO_DATE('01-MAY-2025', 'DD-MON-YYYY');
    end_date := LAST_DAY(start_date);
    sats := NEXT_DAY(start_date - 1, 'SATURDAY');
    suns := NEXT_DAY(start_date - 1,'SUNDAY');
    WHILE sats <= end_date LOOP
        DBMS_OUTPUT.PUT_LINE('Saturday: '||sats);
        IF suns<=end_date then
        DBMS_OUTPUT.PUT_LINE('Sunday: '|| suns);
        END IF;
        sats := sats + 7;  
        suns := suns + 7;
    END LOOP;
END;
/
