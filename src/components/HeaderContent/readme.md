### guide using the HeaderContent
## props: 
#name: string
#id: string
#option: object 
#icon: object
#button: object 

##Here is an example for using the component
``` 
const option = [
	{
		name: 'Reset',
		icon: 'sync'
	}
];
const icon = {
	name: 'more',
	style: {
		background: '#d5cfcf',
		padding: '8px',
		borderRadius: '50%',
		marginTop: '4px'
	}
};
const button = {
	name: 'Save',
	type: 'submit'
};
<HeaderContent name="Create Employee" id="#123456" option={option} icon={icon} button={button} />
```
