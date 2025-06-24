from django.db import models

class Todo(models.Model):
    title = models.CharField(max_length=200) # Changed to 200 for consistency with previous guidance
    description = models.TextField(blank=True, null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # This method is inside the Todo class, correctly indented
    def __str__(self):
        return self.title

    # This Meta class is also inside the Todo class, correctly indented
    class Meta:
        ordering = ['-created_at'] # Orders Todos by creation date, newest first
