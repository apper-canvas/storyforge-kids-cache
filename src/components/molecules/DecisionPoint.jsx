import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const DecisionPoint = ({ 
  decisions = [], 
  onDecisionChange, 
  onDecisionAdd, 
  onDecisionRemove,
  readOnly = false 
}) => {
  const [newDecisionText, setNewDecisionText] = useState('');

  const handleAddDecision = () => {
    if (!newDecisionText.trim()) return;
    
    const newDecision = {
      id: Date.now().toString(),
      text: newDecisionText.trim(),
      targetSceneId: null
    };
    
    onDecisionAdd && onDecisionAdd(newDecision);
    setNewDecisionText('');
  };

  const handleDecisionTextChange = (decisionId, newText) => {
    onDecisionChange && onDecisionChange(decisionId, { text: newText });
  };

  const handleDecisionTargetChange = (decisionId, targetSceneId) => {
    onDecisionChange && onDecisionChange(decisionId, { targetSceneId });
  };

  if (readOnly) {
    return (
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-gray-900 mb-3">What happens next?</h4>
        {decisions.map((decision, index) => (
          <motion.div
            key={decision.id || index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start text-left p-4 hover:bg-primary hover:text-white"
              onClick={() => {
                // Handle decision selection in preview mode
                console.log('Decision selected:', decision);
              }}
            >
              <ApperIcon name="ArrowRight" className="w-5 h-5 mr-3" />
              {decision.text}
            </Button>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Decision Points</h4>
        <span className="text-sm text-gray-500">
          {decisions.length}/3 decisions
        </span>
      </div>

      {/* Existing Decisions */}
      <div className="space-y-3">
        {decisions.map((decision, index) => (
          <motion.div
            key={decision.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-xl p-4 border border-gray-200"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0 mt-1">
                {index + 1}
              </div>
              
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="Enter decision text..."
                  value={decision.text}
                  onChange={(e) => handleDecisionTextChange(decision.id, e.target.value)}
                />
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ApperIcon name="ArrowRight" className="w-4 h-4" />
                  <span>
                    {decision.targetSceneId ? `Goes to Scene ${decision.targetSceneId}` : 'No target scene set'}
                  </span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                icon="Trash2"
                onClick={() => onDecisionRemove && onDecisionRemove(decision.id)}
                className="text-error hover:bg-error/10 flex-shrink-0"
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add New Decision */}
      {decisions.length < 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <Input
              placeholder="Add a new decision option..."
              value={newDecisionText}
              onChange={(e) => setNewDecisionText(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddDecision();
                }
              }}
            />
            
            <Button
              variant="primary"
              size="sm"
              icon="Plus"
              onClick={handleAddDecision}
              disabled={!newDecisionText.trim()}
            >
              Add
            </Button>
          </div>
        </motion.div>
      )}

      {decisions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="GitBranch" className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">No decisions yet</p>
          <p className="text-sm">Add decision points to create branching stories</p>
        </div>
      )}
    </div>
  );
};

export default DecisionPoint;