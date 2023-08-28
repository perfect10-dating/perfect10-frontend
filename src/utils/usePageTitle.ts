/* Code taken from https://dev.to/luispa/how-to-add-a-dynamic-title-on-your-react-app-1l7k
    modified by Theory Millar
*/

import { useEffect, useRef } from "react";

function usePageTitle(title: any, prevailOnUnmount = false) {
	const defaultTitle = useRef(document.title);

	useEffect(() => {
		document.title = title;
	}, [title]);

	useEffect(
		() => () => {
			if (!prevailOnUnmount) {
				document.title = defaultTitle.current;
			}
		},
		[]
	);
}

export default usePageTitle;
