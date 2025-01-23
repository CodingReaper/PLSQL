CREATE OR REPLACE FUNCTION calculate_sum(
    column_name IN VARCHAR2,
    table_name  IN VARCHAR2
) RETURN VARCHAR2
AS
    positive_sum NUMBER;
    negative_sum NUMBER;
    query_str    VARCHAR2(2000);
BEGIN
    query_str := 'SELECT SUM(CASE WHEN ' || column_name || ' > 0 THEN ' || column_name || ' ELSE 0 END), ' ||
                        'SUM(CASE WHEN ' || column_name || ' < 0 THEN ' || column_name || ' ELSE 0 END) ' ||
                 'FROM ' || table_name;
    EXECUTE IMMEDIATE query_str INTO positive_sum, negative_sum;
    RETURN 'Positive Sum: ' || positive_sum || ', Negative Sum: ' || negative_sum;
END;
/
