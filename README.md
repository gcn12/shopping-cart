# GreatFrontEnd

## State
- `shoppingList` is an array of objects representing a user’s shopping list. Each object stores the item name and a unique ID. The ID is required to differentiate between items with the same name.
- `checkedItemIDs`  keeps track of the IDs of items the user has checked off their list.
- `isShowDropdown` determines if the dropdown should be displayed. The dropdown opens when the user focuses on the input and there are items in the `searchResults` array. The dropdown closes when the user clicks on an element outside of the dropdown. `isShowDropdown` is necessary to prevent the dropdown from automatically closing when a user adds an item to their list.
- `searchResults` stores a list of items returned from the API search. An `isAdded` boolean is stored alongside the item name, which is used to notify a user when they add an item to their list.


## Deep dive
- To prevent unnecessary requests to the API, the user’s text input needs to be debounced. This is accomplished by taking advantage of how React renders. When a user types a letter, the `searchQuery` string in state is updated. Because `searchQuery` is in the useEffect dependency array, the timeout within the useEffect runs. If the user doesn’t type again for half a second, the API request is made. However, if the user does type, the effect runs again and the previous setTimeout is cleared in the useEffect cleanup, so the previous request is never made. 
- `structuredClone` When updating state, React requires a brand new version of the data. Because data structures such as arrays, objects, and sets are passed by reference, a new data structure needs to be created before state is updated. Using `structuredClone` is a way of creating a deep copy of the original data before it updates state.
- `useDetectClickOutside` is a custom hook used to detect if a user clicks outside a particular element; in this case the dropdown. It takes two props: a `ref` and a `callback.` The `ref` is what hooks into the React component or HTML element that is being observed. The `callback` can be any function that will run when an outside element is clicked. 
- The objects within `searchResults` have an `isAdded` key, which when set to `true`, displays a checkmark next to the item name. Because the dropdown covers most of the list, the check mark is a visual cue to tell the user that their item has been successfully added. 

## Accessibility
- In order to make the app more accessible, the check and delete buttons contain text labels. For aesthetics, the text is hidden with a CSS class called `visually-hidden`. This ensures that the text exists but cannot be seen
- Headless UI’s dropdown component provides full control over functionality and styling while ensuring an accessible experience

