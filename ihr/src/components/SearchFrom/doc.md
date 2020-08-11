## 搜索组件

#### Options

```
	默认列表选项
	[{
        title: '面试结果',								// 标题
        type: 'select',									// 类型：'select'、'date-picker'、'input'、'btn'。。。后续
        modelKey: '',									// 需要绑定的key，比如id
        optionkey: '',									// 下拉框绑定的key，比如level
        prop: ['id','value'],							// 下拉框的key,value，默认绑定id,value
        warp: true										// 是否换行
     }],
```

#### Attributes
	
> list: 搜索列表
> selectOptions: 搜索下拉框列表
> btnDisabled: 按钮是否可以点击

#### Methods

> change: 返回组件绑定值。一般绑定搜索参数，比如@change='val=>searchParams=val'
> click: 点击按钮回调，一般直接绑定获取列表方法，比如@click='getList'