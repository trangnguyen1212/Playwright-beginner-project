module.exports = {

    "default": {

        "paths": [

            "cucumber/features/"

        ],

        "require": [
          // Step definitions and hooks config in cucumber.js
            "cucumber/features/step_definitions/steps.js", 
            "cucumber/features/support/hooks.js"


        ],

        "formatOptions": {

            "snippetInterface": "async-await"

        },

        "format": [

            [

                "html",

                "cucumber-report.html"

            ],

            "summary",

            "progress-bar",

            "json:./cucumber-report.json"

        ]

    }

}
//npx cucumber-js cucumber/features/ErrorValidation.feature --exit
//npx cucumber-js features/greeting.feature --exit
//npx cucumber-js --parallel 2 --exit --format html:cucumber-report.html
//npx cucumber-js features/greeting.feature --parallel 2 --exit --format html:cucumber-report.html