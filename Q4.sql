DECLARE
 str varchar2(100);
 i integer;
BEGIN
 str:= '&str';
 for i in 1..length(str) LOOP
  dbms_output.put_line(substr(str,i,1));
 end loop;
END;
/