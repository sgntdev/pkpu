export function load({ params }) {
	const {slug, id, uniquecode} = params
    const defaultcode = 'k8d1d21hen1w43d'
	if (defaultcode === uniquecode) {
		return {
			status : 200
		}
	}else{
		return {
			status : 400
		}
	}
}