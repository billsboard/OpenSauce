const SAUCE_TYPE = {
	QUOTE: 0,
	IMAGE: 1
};

const DIFFICULTY = {
	NONE: 0,
	EASY: 1,
	MEDIUM: 2,
	HARD: 3
};

let image_menu = document.getElementById("image_menu");
let quote_menu = document.getElementById("quote_menu");

let input_categories = document.getElementById("input_categories");

let input_load_image = document.getElementById("input_load_image");
let input_image_path = document.getElementById("input_image_path");
let feedback_image_container = document.getElementById("feedback_image_container");
let feedback_image = document.getElementById("feedback_image");

let input_difficulty = document.getElementById("input_difficulty");
let input_difficulty_easy = document.getElementById("input_difficulty_easy");
let input_difficulty_medium = document.getElementById("input_difficulty_medium");
let input_difficulty_hard = document.getElementById("input_difficulty_hard");

let send_button = document.getElementById("send_button");

image_menu.addEventListener("click", show_image_tab);
quote_menu.addEventListener("click", show_quote_tab);

input_load_image.addEventListener("change", update_image);

input_difficulty_easy.addEventListener("click", set_difficulty_easy);
input_difficulty_medium.addEventListener("click", set_difficulty_medium);
input_difficulty_hard.addEventListener("click", set_difficulty_difficult);

input_categories.addEventListener("change", change_category);

send_button.addEventListener("click", send);

let sauce_type;
let sauce_category;
let sauce_image;
let sauce_quote;
let sauce_answer;
let sauce_difficulty;

show_image_tab();
clear_difficulites();

function update_image(e) {
	//https://stackoverflow.com/questions/3814231/loading-an-image-to-a-img-from-input-file/16153675
	if (e.target.files.length > 0) {
		let selected_file = e.target.files[0];
		let reader = new FileReader();
		feedback_image_container.hidden = false;

		input_image_path.innerHTML = selected_file.name;

		reader.addEventListener("load", function(e) {
			feedback_image.src = e.target.result;
			sauce_image = e.target.result;
		});

		reader.readAsDataURL(selected_file);
	}
}

function change_category() {
	sauce_category = input_categories.options[input_categories.selectedIndex].value;
}

function show_image_tab() {
	sauce_type = SAUCE_TYPE.IMAGE;
	Tools.set_class_hidden("image-only", false);
	Tools.set_class_hidden("quote-only", true);
	image_menu.classList.add("active");
	quote_menu.classList.remove("active");
}

function show_quote_tab() {
	sauce_type = SAUCE_TYPE.QUOTE;
	Tools.set_class_hidden("image-only", true);
	Tools.set_class_hidden("quote-only", false);
	image_menu.classList.remove("active");
	quote_menu.classList.add("active");
}

function clear_difficulites() {
	sauce_difficulty = DIFFICULTY.NONE;
	input_difficulty_easy.classList.remove("bg-success");
	input_difficulty_medium.classList.remove("bg-warning");
	input_difficulty_hard.classList.remove("bg-danger");
	input_difficulty_easy.classList.add("text-success");
	input_difficulty_medium.classList.add("text-warning");
	input_difficulty_hard.classList.add("text-danger");
}

function set_difficulty_easy() {
	clear_difficulites();
	sauce_difficulty = DIFFICULTY.EASY;
	input_difficulty_easy.classList.add("bg-success");
	input_difficulty_easy.classList.add("text-white");
	input_difficulty_easy.classList.remove("text-success");
}

function set_difficulty_medium() {
	clear_difficulites();
	sauce_difficulty = DIFFICULTY.MEDIUM;
	input_difficulty_medium.classList.add("bg-warning");
	input_difficulty_medium.classList.add("text-white");
	input_difficulty_medium.classList.remove("text-warning");
}

function set_difficulty_difficult() {
	clear_difficulites();
	sauce_difficulty = DIFFICULTY.HARD;
	input_difficulty_hard.classList.add("bg-danger");
	input_difficulty_hard.classList.add("text-white");
	input_difficulty_hard.classList.remove("text-danger");
}

function validate() {
	let isInvalid = false;

	isInvalid |= Tools.update_invalide_class(input_categories, input_categories.value == "");
	if (sauce_type == SAUCE_TYPE.IMAGE) {
		isInvalid |= Tools.update_invalide_class(input_load_image, sauce_image == "" || sauce_image == undefined);
	} else if (sauce_type == SAUCE_TYPE.QUOTE) {
		isInvalid |= Tools.update_invalide_class(input_quote, input_quote.value == "");
	}
	isInvalid |= Tools.update_invalide_class(input_answer, input_answer.value == "");
	isInvalid |= Tools.update_invalide_class(input_difficulty, sauce_difficulty == 0);
	return !isInvalid;
}

function post_data(url = ``, data = {}) {
	//https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
	// Default options are marked with *
	console.log(data);
	return fetch(url, {
			method: "POST", // *GET, POST, PUT, DELETE, etc.
			mode: "cors", // no-cors, cors, *same-origin
			cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
			credentials: "same-origin", // include, *same-origin, omit
			headers: {
				"Content-Type": "application/json",
				// "Content-Type": "application/x-www-form-urlencoded",
			},
			redirect: "follow", // manual, *follow, error
			referrer: "no-referrer", // no-referrer, *client
			body: JSON.stringify(data), // body data type must match "Content-Type" header
		})
		.then(response => response.json()); // parses response to JSON
}

function send(e) {
	if (validate()) {
		console.log("send");
		data = {};
		data["type"] = sauce_type;
		if (sauce_type == SAUCE_TYPE.IMAGE) {
			data["image"] = sauce_image;
		} else if (sauce_type == SAUCE_TYPE.QUOTE) {
			data["image"] = input_quote.value;
		}
		data["answer"] = input_answer.value;
		data["difficulty"] = sauce_difficulty;
		data["sauce_category"] = sauce_category;
		post_data(`/add/`, data)
			.then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
			.catch(error => console.error(error));
	} else {
		e.preventDefault();
		console.log("cancel");
	}
	console.log(e);
}
