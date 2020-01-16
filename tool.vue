/**
 * 字典转换格式
 * @author 王昆
 * @date 2020-1-16
 * obj格式：{dataList:'字典数组',value:'要改变的值',label:'改变对应的值',data:'传入的值'}
 */

getDatatype(obj) => {
	let name = obj.data
	obj.dataList.forEach(el => {
		if(el[obj.value]==obj.data) {
			name = el[obj.label]
		}
	})
	return name
}