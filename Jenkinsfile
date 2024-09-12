pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {

        stage("Install Environment") {
            steps {
                echo 'Installing Environment'
                sh 'npm install'
            }
        }

        stage("API UP"){
            steps {
                echo 'API UP'
                sh 'npm run dev'
            }
        }

    }
}