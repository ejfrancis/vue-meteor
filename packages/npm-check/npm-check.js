import {_} from 'meteor/underscore';

Plugin.registerCompiler({
  filenames: ['npm.json']
}, () => new NpmCheck());

class NpmCheck {
  processFilesForTarget(files) {
    this.deps = {
      dependencies: {},
      devDependencies: {}
    };

    for(let file of files) {
      this.processFile(file);
    }

    if(checkNpmDeps(this.deps)) {
      console.log('\nSome packages depends on these peer dependencies:\n');
      console.log(this.deps);
      if(process.env.NODE_ENV === 'development') {
        console.log('\nYour package.json has been updated, now running: meteor npm install\n');
        let result = execSync('meteor npm install', {cwd: CWD});
      } else {
        console.log('\nYour package.json has been updated, /!\\ you may need to run: meteor npm install');
      }
    }
  }

  processFile(inputFile) {
    let contents = inputFile.getContentsAsString();
    let d = JSON.parse(contents);
    _.extend(this.deps.dependencies, d.dependencies);
    _.extend(this.deps.devDependencies, d.devDependencies);
  }
}