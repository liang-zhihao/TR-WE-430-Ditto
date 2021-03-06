let formData = new FormData();
let coverFile = document.getElementById('cover-input');

function uploadCover(obj) {
    let reader = new FileReader()
    reader.readAsDataURL(coverFile.files[0])
    reader.onload = function (e) {
        document.getElementById('cover').src = this.result;
    }
    formData.append("coverImg", coverFile.files[0])
}

function uploadStepImg(index,obj) {
    if (index === -1) {
        index = $(obj).attr('id').split('-')[3]

    }
    let stepFile = document.getElementById(`img-input-step-${index}`)
    let reader = new FileReader()

    reader.readAsDataURL(stepFile.files[0])
    reader.onload = function (e) {
        document.getElementById(`img-step-${index}`).src = this.result;
    }
    formData.append(`stepImg-${index}`, stepFile.files[0])
}

function getIngredients() {
    const div = document.getElementById("div-ingredients")
    let ingredientsJson = []

    for (const ele of div.children) {

        let ingredient = $(ele.children[0]).val().trim()
        let amount = $(ele.children[1]).val().trim()
        if (ingredient.length !== 0 && amount.length !== 0)
            ingredientsJson.push({
                ingredientName: ingredient, amount
            })
    }
    return ingredientsJson
}

function delIngredientEle(index,obj) {
    if(index===-1){
        index=$(obj).attr('id').split('-')[2]
    }
    const div = document.getElementById("div-ingredients")
    const size = div.children.length
    if (size > 1) {
        $(`#ingred-${index}`).remove()

    }


}

$("#btn-addStep").click(function () {
    const div = document.getElementById("div-steps")
    const size = div.children.length

    const html =
        `
            <div class="d-flex mt-5 justify-content-between align-content-between" id="step-${size + 1}">
                <div class="d-flex flex-column w-75 mr-3">
                 <h4 class="font-comic"> Step${size + 1}</h4>
                
                    <textarea class="h-100 input-area-red" name="textarea"
                              placeholder="Add step here"></textarea>

                </div>
                <div class="d-flex flex-column "><img id="img-step-${size + 1}" class="rounded-20 mb-1"  src="http://iph.href.lu/1280x1024" alt="" width="300"
                                                      width="300">                        <label class="btn custom-file-upload btn-red">
                 <input id="img-input-step-${size + 1}" type="file" class="btn-red" ACCEPT="image/*" onchange="uploadStepImg(${size + 1})">
                                
                    <i class="iconfont icon-LocalUpload"></i>
                     Upload a Step Picture
                </label></div>

            </div>
            `
    $(div).append(html)

})


$("#btn-removeStep").click(function () {
    const div = document.getElementById("div-steps")
    const size = div.children.length
    if (size > 1) {


        div.lastElementChild.remove()
    }

})


$("#btn-addIngredient").click(function () {
    const div = document.getElementById("div-ingredients")
    const size = div.children.length
    let newSize = size + 1
    let childHtml = ` <div class="d-flex justify-content-between mt-2" id="ingred-${newSize}"><input class="mr-3 input-red" type="text"
                                                                                                        placeholder="Name"> <input
                class="input-red" type="text"
                placeholder="Amount"> <button
                class="btn iconfont icon-x" onclick="delIngredientEle(${newSize})"> </button>
            </div>`
    $("#div-ingredients").append(childHtml)
})


function getStepsContent() {
    const div = document.getElementById("div-steps")
    let steps = []
    let ind = 0;
    for (const ele of div.children) {

        ind++;
        let stepOrder = ind;
        let stepContent = $(ele).find('textarea').val().trim();
        steps.push({
            stepOrder, stepContent
        })
    }
    return steps
}

function getTags() {
    let tags = $(".input-tags").val().split(",")
    let newTags = []
    for (let tag of tags) {
        if (tag.trim().length !== 0) {
            newTags.push({tagName: tag.trim()})
        }

    }
    return newTags

}

function getJsonData() {
    let errors = []
    const title = $("#input-title").val().trim();
    const description = $("#input-describe").val().trim();
    //poor validate
    const recipe = {
        recipeName: title, recipeDescription: description, recipeCreatedTime: moment().format(), recipeAuthorId: userId,
    };
    errors.push(validate(recipe, {
        recipeName: {
            length: {
                minimum: 3,
                message: "%{value} is too short. Recipe name should be at least 3 characters"
            }
        },
        recipeDescription: {
            length: {
                minimum: 3,
                message: "%{value} is too short. Recipe description should be at least 3 characters"
            }
        }
    }))

    const tags = getTags()
    const steps = getStepsContent()
    for (const step of steps) {
        errors.push(validate(step, {
            stepContent: {
                length: {
                    minimum: 3,
                    message: "%{value} is too short. Each recipe step should be at least 3 characters"
                }
            }
        }))
    }
    const ingredients = getIngredients()
    for (const ingredient of ingredients) {
        errors.push(validate(ingredient, {
            ingredient: {
                length: {
                    minimum: 3,
                    message: "%{value} is too short. Each ingredient step should be at least 3 characters"
                }
            }, amount: {
                length: {
                    minimum: 3,
                    message: "%{value} is too short. Each amount should be at least 3 characters"
                }
            }
        }))
    }

    let data = {
        recipe, steps, ingredients, tags,
    }
    return data

}

function submit() {
    let data = getJsonData()
    formData.append("data", JSON.stringify(data))
    bootbox.confirm("Are you sure you want to submit this recipe?", function (result) {

        if (result) {
            loading();
            axios.post('/api/recipe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                completeLoading()
                console.log(res)
                let recipeId = res['data']['data']['recipeId']
                bootbox.alert("Add a recipe Successfully!")
                window.location.replace('/recipe/' + recipeId)
                // window.location.replace("/");
            }).catch(err => {
                completeLoading()
                bootbox.alert("Failed to add")
                console.log(err)
            })
            formData = new FormData()
        }
    })
}

function update() {
    let data = getJsonData()
    data['recipe']['recipeId'] = recipeId
    console.log({data})
    formData.append("data", JSON.stringify(data))

    bootbox.confirm("Are you sure you want to update this recipe?", function (result) {
        if (result) {
            loading();
            axios.put('/api/recipe', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                completeLoading()
                console.log(res)

                bootbox.alert("Update the recipe Successfully!")
                formData = new FormData()
                window.location.replace('/recipe/' + recipeId)
                // window.location.replace("/");
            }).catch(err => {
                completeLoading()
                bootbox.alert("Failed to add")
                console.log(err)
            })

        }
    })

}