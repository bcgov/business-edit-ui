## Build the pipeline

```bash
oc process -f templates/pipeline.yaml -p TAG=dev -p JENKINS_FILE=./Jenkinsfiles/dev.groovy | oc create -f -
oc process -f templates/pipeline.yaml -p TAG=test -p JENKINS_FILE=./Jenkinsfiles/test.groovy | oc create -f -
oc process -f templates/pipeline.yaml -p TAG=prod -p JENKINS_FILE=./Jenkinsfiles/prod.groovy | oc create -f -
```

## BuildConfig

```bash
oc process -f templates/bc.yaml | oc create -f -
```

## DeploymentConfig

```bash
oc process -f templates/dc.yaml -p TAG=dev -p APPLICATION_DOMAIN=business-edit-dev.apps.silver.devops.gov.bc.ca | oc create -f -
oc process -f templates/dc.yaml -p TAG=test -p APPLICATION_DOMAIN=business-edit-test.apps.silver.devops.gov.bc.ca | oc create -f -
oc process -f templates/dc.yaml -p TAG=prod -p APPLICATION_DOMAIN=business-edit.apps.silver.devops.gov.bc.ca | oc create -f -


```
