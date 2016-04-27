#!groovy

// `Jenkinsfile` is a groovy script DSL for defining CI/CD workflows for Jenkins
stage 'Build'

node {
  checkout scm
  sh "npm install"
  sh "npm test:ci"
  step([$class: 'JUnitResultArchiver', testResults: 'test-results.xml'])
}
