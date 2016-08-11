#!groovy

stage 'Build'

node {
  checkout scm
  sh "npm install"
  sh "npm run test:ci"
}
