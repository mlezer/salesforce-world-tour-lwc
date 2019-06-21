# Salesforce World Tour Paris - Migrate your Lightning Components to Lightning Web Components

## Installation instructions

1. Set up your environment. Follow the steps in the [Quick Start: Lightning Web Components](https://trailhead.salesforce.com/content/learn/projects/quick-start-lightning-web-components/) Trailhead project. The steps include:

-   Enable Dev Hub in your Trailhead Playground
-   Install Salesforce CLI
-   Install Visual Studio Code
-   Install the Visual Studio Code Salesforce extensions, including the Lightning Web Components extension

2. If you haven't already done so, authenticate with your hub org and provide it with an alias (**myhuborg** in the command below):

```
sfdx force:auth:web:login -d -a myhuborg
```

3. Clone the salesforce-world-tour-lwc repository:

```
git clone https://github.com/mlezer/salesforce-world-tour-lwc.git
cd salesforce-world-tour-lwc
```

4. Create a scratch org and provide it with an alias (**salesforce-world-tour-lwc** in the command below):

```
sfdx force:org:create -s -f config/project-scratch-def.json -a salesforce-world-tour-lwc
```

5. Push the app to your scratch org:

```
sfdx force:source:push
```

6. Query the standard pricebook Id:
   
```
sfdx force:data:soql:query -q "SELECT Id FROM Pricebook2 WHERE IsStandard = true
```

7. Copy the result. Replace all the `01s5E000000d4xEQAQ` occurrences in the `export-demo-PricebookEntrys.json` file by the previously copied Id.

8. Import the data:

```
sfdx force:data:tree:import --targetusername salesforce-world-tour-lwc --plan sfdx-out/export-demo-Opportunity-OpportunityLineItem-plan.json
```

9.  Assign the **Opportunity Search** permission set to the default user:

```
sfdx force:user:permset:assign -n Opportunity_Search
```

10. Open the scratch org:

```
sfdx force:org:open
```

11.  In App Launcher, select the **Sales** app.