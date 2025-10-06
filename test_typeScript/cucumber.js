module.exports = {

    "default": {

        "paths": [

            "test_typeScript/cucumber/features/"

        ],

        "require": [
            // Step definitions and hooks config in cucumber.js 

            "test_typeScript/cucumber/features/step_definitions/steps.ts", 
            "test_typeScript/cucumber/features/support/hooks.ts"

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
//npx cucumber-js test_typeScript/cucumber/features/greeting_ts.feature test
//npx cucumber-js cucumber/features/ErrorValidation.feature --exit
//npx cucumber-js features/greeting.feature --exit
//npx cucumber-js --parallel 2 --exit --format html:cucumber-report.html
//npx cucumber-js features/greeting.feature --parallel 2 --exit --format html:cucumber-report.html