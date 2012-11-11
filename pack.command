cd `dirname $0`
mkdir ./output
rm ./output/tddjs.zip
zip -r ./output/tddjs.zip . -i lib/* source/AjaxLab/* source/DOMManipulationSample/* source/GettingItWorking/* source/LunEx/* source/MessTrekLab/*/* source/TestedTrekLab/*/*
