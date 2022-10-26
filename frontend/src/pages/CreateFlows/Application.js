import * as SRD from '@projectstorm/react-diagrams';

import { JSCustomNodeFactory } from './nodes/Custom/JSCustomNodeFactory';
import { ChatNodeFactory } from './nodes/Chat/ChatNodeFactory';
import { AdvancedLinkFactory } from './links/AdvancedLink/AdvancedLinkFactory';
import { AdvancedPortFactory } from './ports/AdvancedPort/AdvancedPortFactory';
import { StartNodeFactory } from './nodes/Start/StartNodeFactory';
import { StartNodeModel } from './nodes/Start/StartNodeModel';
import { AdvancedPortModel } from './ports/AdvancedPort/AdvancedPortModel';
import { ConditionalNodeFactory } from './nodes/Conditional/ConditionalNodeFactory';

export class Application {
	constructor() {
		this.diagramEngine = SRD.default();
		this.newModel();
	}

	newModel() {
		this.activeModel = new SRD.DiagramModel();
		this.diagramEngine.setModel(this.activeModel);

		this.diagramEngine.getNodeFactories().registerFactory(new ChatNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new StartNodeFactory());
		this.diagramEngine.getNodeFactories().registerFactory(new ConditionalNodeFactory());

		this.diagramEngine.getLinkFactories().registerFactory(new AdvancedLinkFactory());
		this.diagramEngine.getPortFactories().registerFactory(new AdvancedPortFactory());

		const state = this.diagramEngine.getStateMachine().getCurrentState();
		if (state instanceof SRD.DefaultDiagramState) {
			state.dragNewLink.config.allowLooseLinks = false;
		}

		this.activeModel.registerListener({
			linksUpdated:(event) => {
				const { link, isCreated } = event;
				link.registerListener({
					targetPortChanged:(link) => {
						if (isCreated) {
							const {sourcePort, targetPort} = link.entity;

							if (Object.keys(sourcePort.getLinks()).length > 1) {
								// console.log("Source -> IF")
								const links = sourcePort.getLinks();
								const keys = Object.keys(sourcePort.getLinks());

								for (const key of keys) {
									if (key !== link.entity.getID()) {
										this.activeModel.removeLink(links[key]);
										sourcePort.removeLink(links[key]);
									}
								}
								
								// this.activeModel.removeLink(link.entity);
								// sourcePort.removeLink(link.entity);
							} else {
								// console.log("Source -> ELSE")
								let { parent : 
										{ options : sourceOptions }
									} = sourcePort;
		
								let { parent : 
										{ options : targetOptions }
									} = targetPort;

								if (sourceOptions.dataType === 'start' && targetOptions.dataType === 'value'){
									this.activeModel.removeLink(link.entity);
									sourcePort.removeLink(link.entity);
								}
							}

							if (Object.keys(targetPort.getLinks()).length > 1) {
								// console.log("Target -> IF")
								const links = targetPort.getLinks();
								const keys = Object.keys(targetPort.getLinks());

								for (const key of keys) {
									if (key !== link.entity.getID()) {
										this.activeModel.removeLink(links[key]);
										targetPort.removeLink(links[key]);
									}
								}

								// this.activeModel.removeLink(link.entity);
								// targetPort.removeLink(link.entity);
							} else {
								// console.log("Target -> ELSE")
								let { parent : 
										{ options : sourceOptions }
									} = sourcePort;
		
								let { parent : 
										{ options : targetOptions }
									} = targetPort;

								if (sourceOptions.dataType === 'start' && targetOptions.dataType === 'value'){
									this.activeModel.removeLink(link.entity);
									targetPort.removeLink(link.entity);
								}
							}
						}
					}
				});				
			}
		});

		const start = new StartNodeModel();
		start.addPort(new AdvancedPortModel(false, "out"));
		start.setPosition(100, 100);
		this.activeModel.addAll(start);

		// //!------------- SERIALIZING ------------------

		// var str = JSON.stringify(this.activeModel.serialize());

		// //!------------- DESERIALIZING ----------------

		// this.activeModel.deserializeModel(JSON.parse(str), this.diagramEngine);
		// this.diagramEngine.setModel(this.activeModel);

		// const pathfinding = this.diagramEngine.getLinkFactories().getFactory(SRD.PathFindingLinkFactory.NAME);

		// //3-B) create another default node
		// var node2 = new SRD.DefaultNodeModel('Node 2', 'rgb(192,255,0)');
		// let port2 = node2.addInPort('In');
		// node2.setPosition(400, 100);

		// // link the ports
		// let link1 = port.link(port2, pathfinding);
	}

	getActiveDiagram() {
		return this.activeModel;
	}

	getDiagramEngine() {
		return this.diagramEngine;
	}
}