select d.name,(d.salary-maxsal.maxs) as saldiff from department d join (select dept_id,max(salary) as maxs from department group by dept_id) maxsal on d.dept_id = ma
xsal.dept_id;