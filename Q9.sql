select e.* from employeeinfo e 
join employeepos p on e.id = p.empid 
where p.DOJ is NOT NULL;